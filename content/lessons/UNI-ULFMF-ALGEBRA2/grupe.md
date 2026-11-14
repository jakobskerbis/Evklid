---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ko so biologi s krioelektronsko mikroskopijo prvič natančno pogledali plašč (kapsido) majhnih virusov, so našli presenetljivo pravilnost. Plašč satelitskega virusa tobačne nekroze je sestavljen iz natanko $60$ enakih beljakovinskih podenot; večji virusi imajo $180$, $240$ ali $420$ podenot, nikoli pa na primer $50$ ali $100$. Matrike in lastne vrednosti iz linearne algebre opišejo vsako posamezno vrtenje plašča, ne povedo pa, zakaj je ravno $60$ posebno število.

Odgovor je v strukturi **vseh** vrtenj hkrati. Vrtenja, ki ikozaeder preslikajo vase, se dajo sestavljati, imajo obratna vrtenja in vsebujejo identiteto. Taka množica je **grupa** in ima natanko $60$ elementov. Če vsaka podenota leži na »svojem« mestu, ki ga vrtenja premečejo na vsa druga mesta, je podenot ravno toliko, kot je elementov grupe. Grupe so jezik simetrije v kemiji, kristalografiji, fiziki delcev in kriptografiji. Iz linearne algebre že poznaš nekaj grup: obrnljive, ortogonalne in rotacijske matrike.

## Razlaga

**1. Grupa.**

**Definicija.** **Grupa** je množica $G$ z operacijo $\ast$, ki vsakemu paru $a, b \in G$ priredi $a \ast b \in G$ (zaprtost), in velja:

1. **asociativnost:** $(a \ast b) \ast c = a \ast (b \ast c)$ za vse $a, b, c$;
2. **enota:** obstaja $e \in G$ z $e \ast a = a \ast e = a$ za vse $a$;
3. **inverzi:** za vsak $a$ obstaja $a^{-1}$ z $a \ast a^{-1} = a^{-1} \ast a = e$.

Če velja še $a \ast b = b \ast a$ za vse $a, b$, je grupa **komutativna** (Abelova). Število elementov $\lvert G \rvert$ je **red grupe**.

Primeri: $(\mathbb Z, +)$ z enoto $0$; $(\mathbb R \setminus \{0\}, \cdot)$ z enoto $1$; $\mathrm{GL}_n(\mathbb R)$ (obrnljive matrike $n \times n$ z množenjem), ki za $n \ge 2$ ni komutativna; $\mathbb Z_n = \{0, 1, \dots, n - 1\}$ s seštevanjem po modulu $n$. Ni grupa: $(\mathbb N, +)$, ker $3$ nima nasprotnega elementa; $(\mathbb Z, \cdot)$, ker $2$ nima obratnega.

*Preveri v eni vrstici:* je množica ortogonalnih matrik $\mathrm O(n)$ z množenjem grupa? (Da: $Q_1Q_2$ je ortogonalna, $Q^{-1} = Q^T$ je ortogonalna, $I$ je enota.)

**2. Prve lastnosti.** **Trditev.** V grupi je enota ena sama, vsak element ima en sam inverz, velja $(ab)^{-1} = b^{-1}a^{-1}$ in krajšanje: iz $ab = ac$ sledi $b = c$.

**Dokaz.** Če sta $e$ in $e'$ enoti, je $e = ee' = e'$. Če sta $b$ in $c$ inverza od $a$, je $b = b(ac) = (ba)c = c$. Ker je $(ab)(b^{-1}a^{-1}) = a(bb^{-1})a^{-1} = e$, je $b^{-1}a^{-1}$ inverz od $ab$. Krajšanje: obe strani $ab = ac$ pomnožimo z leve z $a^{-1}$. $\square$

Vrstni red pri $(ab)^{-1}$ je obrnjen kot pri slačenju: najprej sezuješ čevelj, nato nogavico. Odslej operacijo pišemo kot množenje, $ab$.

**3. Red elementa.** Za $a \in G$ pišemo $a^k = a \cdots a$ ($k$-krat). **Red elementa** $a$ je najmanjši $k \ge 1$ z $a^k = e$ (če obstaja). Grupa je **ciklična**, če obstaja $g$, da je vsak element cela potenca $g$ (tudi $g^0 = e$ in $g^{-k} = (g^{-1})^k$); tedaj $G = \langle g \rangle$. $\mathbb Z_n$ je ciklična z generatorjem $1$.

*Preveri v eni vrstici:* kakšen red ima $4$ v $\mathbb Z_6$? ($4, 8 \equiv 2, 12 \equiv 0$, torej red $3$.)

**4. Podgrupe.**

**Definicija.** Podmnožica $H \subseteq G$ je **podgrupa** ($H \le G$), če je za isto operacijo sama grupa.

**Izrek (kriterij podgrupe).** Neprazna $H \subseteq G$ je podgrupa natanko tedaj, ko za vse $a, b \in H$ velja $ab^{-1} \in H$.

**Dokaz.** Podgrupa očitno zadošča pogoju. Obratno: vzemimo $a \in H$; za $b = a$ je $e = aa^{-1} \in H$. Iz $e, b \in H$ sledi $b^{-1} = eb^{-1} \in H$. Za $a, b \in H$ je zato $ab = a(b^{-1})^{-1} \in H$. Asociativnost se podeduje iz $G$. $\square$

Primeri: $\mathrm{SO}(n) \le \mathrm O(n) \le \mathrm{GL}_n(\mathbb R)$; $n\mathbb Z \le \mathbb Z$; $\{0, 2, 4\} \le \mathbb Z_6$.

**Definicija.** Za $H \le G$ in $a \in G$ je $aH = \{ah : h \in H\}$ **levi odsek** podgrupe $H$.

**Izrek (Lagrange).** Če je $G$ končna in $H \le G$, potem $\lvert H \rvert$ deli $\lvert G \rvert$.

**Dokaz.** (i) Vsak odsek ima $\lvert H \rvert$ elementov: preslikava $h \mapsto ah$ je injektivna zaradi krajšanja. (ii) Dva odseka sta enaka ali disjunktna: če je $x \in aH \cap bH$, je $x = ah_1 = bh_2$, torej $a = bh_2h_1^{-1} \in bH$ in $aH \subseteq bH$; simetrično $bH \subseteq aH$. (iii) Vsak $a$ leži v $aH$, saj $e \in H$. Odseki torej razdelijo $G$ na enako velike kose, zato $\lvert G \rvert = k \cdot \lvert H \rvert$, kjer je $k$ število odsekov. $\square$

**Posledica.** Red vsakega elementa deli $\lvert G \rvert$ (red $a$ je red podgrupe $\langle a \rangle$). Grupa praštevilskega reda je ciklična (Naloga 2).

:::premisli
Ali lahko ima grupa s $15$ elementi element reda $4$? Ali lahko ima podgrupo s $6$ elementi?
---
Ne in ne. Po Lagrangeu red elementa in red podgrupe delita $15$. Delitelji števila $15$ so le $1, 3, 5, 15$.
:::

**5. Permutacije.** **Permutacija** množice $\{1, \dots, n\}$ je bijekcija nase. Vse permutacije s kompozitumom tvorijo **simetrično grupo** $S_n$ reda $n!$. Dogovor: $\sigma\tau$ pomeni »najprej $\tau$, nato $\sigma$« (kot pri kompozitumu funkcij).

**Cikel** $(a_1\;a_2\;\dots\;a_k)$ pošlje $a_1 \mapsto a_2 \mapsto \dots \mapsto a_k \mapsto a_1$, ostale točke pusti. Cikel dolžine $2$ je **transpozicija**.

**Izrek.** (a) Vsaka permutacija je produkt disjunktnih ciklov, enolično do vrstnega reda. (b) Red permutacije je najmanjši skupni večkratnik dolžin njenih ciklov. (c) Vsaka permutacija je produkt transpozicij; parnost njihovega števila je za dano permutacijo vedno enaka.

Razcep v (a) dobiš tako, da slediš točki $1$, dokler se ne vrne, nato vzameš najmanjšo neuporabljeno točko. Za (b): disjunktni cikli komutirajo, cikel dolžine $k$ ima red $k$. Za (c): $(a_1\;a_2\;\dots\;a_k) = (a_1\;a_k)\cdots(a_1\;a_3)(a_1\;a_2)$, torej je cikel dolžine $k$ produkt $k - 1$ transpozicij.

**Definicija.** **Predznak** $\operatorname{sgn}\sigma$ je $+1$, če je $\sigma$ produkt sodega števila transpozicij (soda permutacija), in $-1$ sicer. Sode permutacije tvorijo **alternirajočo grupo** $A_n$ reda $\frac{n!}{2}$ (za $n \ge 2$). Predznak poznaš iz Leibnizove formule za determinanto.

*Preveri v eni vrstici:* je $(1\;2\;3)$ soda? (Da: dolžina $3$ da $2$ transpoziciji.)

**6. Homomorfizmi.**

**Definicija.** Preslikava $f\colon G \to K$ med grupama je **homomorfizem**, če je $f(ab) = f(a)f(b)$ za vse $a, b \in G$. Bijektiven homomorfizem je **izomorfizem** ($G \cong K$). **Jedro** je $\ker f = \{a \in G : f(a) = e_K\}$, **slika** pa $\operatorname{im} f = f(G)$.

**Trditev.** Za homomorfizem velja $f(e_G) = e_K$ in $f(a^{-1}) = f(a)^{-1}$; $\ker f$ je podgrupa v $G$, $\operatorname{im} f$ je podgrupa v $K$; $f$ je injektiven natanko tedaj, ko je $\ker f = \{e_G\}$.

**Dokaz.** Iz $f(e) = f(ee) = f(e)f(e)$ s krajšanjem $f(e) = e_K$. Iz $f(a)f(a^{-1}) = f(e) = e_K$ sledi $f(a^{-1}) = f(a)^{-1}$. Za $a, b \in \ker f$ je $f(ab^{-1}) = e_K e_K^{-1} = e_K$, zato je $\ker f$ po kriteriju podgrupa; za sliko podobno. Če je $f$ injektiven, je v jedru le $e_G$. Obratno: iz $f(a) = f(b)$ sledi $f(ab^{-1}) = e_K$, torej $ab^{-1} \in \ker f = \{e\}$ in $a = b$. $\square$

Primeri: $\det\colon \mathrm{GL}_n(\mathbb R) \to \mathbb R \setminus \{0\}$ z jedrom $\mathrm{SL}_n(\mathbb R)$; $\operatorname{sgn}\colon S_n \to \{1, -1\}$ z jedrom $A_n$; $\exp\colon (\mathbb R, +) \to (\mathbb R_{>0}, \cdot)$ je izomorfizem, saj $e^{x+y} = e^xe^y$.

:::premisli
Zakaj $f\colon \mathbb Z \to \mathbb Z$, $f(x) = x + 1$, ni homomorfizem, čeprav je bijekcija? Kateri pogoj iz trditve takoj pade?
---
Homomorfizem mora enoto poslati v enoto, $f(0) = 0$. Tu je $f(0) = 1$. Res: $f(1 + 1) = 3$, $f(1) + f(1) = 4$.
:::

## Rešeni primeri

### Primer 1 (lažji)

V $S_5$ sta $\sigma = (1\;3\;5)(2\;4)$ in $\tau = (1\;2)(3\;4\;5)$. Izračunaj $\sigma\tau$ in $\tau\sigma$, red in predznak $\sigma$ ter $\sigma^{-1}$.

**Podatki:** $\sigma = (1\;3\;5)(2\;4)$, $\tau = (1\;2)(3\;4\;5)$ v $S_5$; $\sigma\tau$ pomeni najprej $\tau$
**Iščemo:** $\sigma\tau$, $\tau\sigma$, red in $\operatorname{sgn}\sigma$, $\sigma^{-1}$

:::formula
Red je $\operatorname{nzv}$ dolžin disjunktnih ciklov; cikel dolžine $k$ je produkt $k - 1$ transpozicij; inverz cikla je isti cikel v obratnem vrstnem redu.
:::

**Rešitev:**

1. $\sigma\tau$, točka $1$: $\tau$ jo pošlje v $2$, $\sigma$ dvojko v $4$; torej $1 \mapsto 4$. Točka $4$: $\tau$ v $5$, $\sigma$ v $1$; torej $4 \mapsto 1$.
2. Točka $2$: $\tau$ v $1$, $\sigma$ v $3$; točka $3$: $\tau$ v $4$, $\sigma$ v $2$. Točka $5$: $\tau$ v $3$, $\sigma$ v $5$, torej negibna. Sledi $\sigma\tau = (1\;4)(2\;3)$.
3. Na enak način $\tau\sigma = (1\;4)(2\;5)$. Ker $\sigma\tau \ne \tau\sigma$, $S_5$ ni komutativna.
4. Red: cikla dolžin $3$ in $2$ dasta $\operatorname{nzv}(3, 2) = 6$.
5. Predznak: $2 + 1 = 3$ transpozicije, liha permutacija, $\operatorname{sgn}\sigma = -1$.
6. Inverz: $\sigma^{-1} = (1\;5\;3)(2\;4)$.
7. Odgovor: $\sigma\tau = (1\;4)(2\;3)$, $\tau\sigma = (1\;4)(2\;5)$; $\sigma$ ima red $6$, je liha, $\sigma^{-1} = (1\;5\;3)(2\;4)$.

### Primer 2

Kapsida ima obliko pravilnega ikozaedra ($12$ oglišč, $20$ ploskev, $30$ robov). Preštej vrtenja, ki ikozaeder preslikajo vase. Katere rede lahko imajo podgrupe te grupe in katere rede imajo njeni elementi?

**Podatki:** ikozaeder: $12$ oglišč (po $5$ ploskev ob oglišču), $20$ trikotnih ploskev, $30$ robov
**Iščemo:** red grupe vrtenj $G$, mogoči redi podgrup in redi elementov

:::formula
Vsako vrtenje razen identitete ima os skozi par nasprotnih oglišč, središč ploskev ali središč robov. Lagrange: red podgrupe deli $\lvert G \rvert$.
:::

**Rešitev:**

1. Identiteta: $1$ element.
2. Osi skozi nasprotni oglišči: $\frac{12}{2} = 6$ osi; ob oglišču se stika $5$ ploskev, zato so vrtenja za $72°$, $144°$, $216°$, $288°$: $6 \cdot 4 = 24$ elementov reda $5$.
3. Osi skozi središči nasprotnih ploskev: $\frac{20}{2} = 10$ osi, vrtenji za $120°$ in $240°$: $10 \cdot 2 = 20$ elementov reda $3$.
4. Osi skozi središči nasprotnih robov: $\frac{30}{2} = 15$ osi, vrtenje za $180°$: $15$ elementov reda $2$.
5. Skupaj: $1 + 24 + 20 + 15 = 60$.
6. Redi elementov $1, 2, 3, 5$ res delijo $60$. Podgrupa ima lahko le red, ki deli $60$: $1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60$. (Lagrange pove, kateri redi so **mogoči**; ne zagotavlja, da podgrupa vsakega reda obstaja.)
7. Odgovor: grupa vrtenj ikozaedra ima $60$ elementov; redi elementov so $1, 2, 3, 5$. Kapsida z eno podenoto na vsak element grupe ima $60$ podenot.

### Primer 3 (težji)

Naj bo $f\colon \mathrm{GL}_2(\mathbb R) \to \mathbb R \setminus \{0\}$, $f(A) = \det A$. (a) Dokaži, da je $f$ homomorfizem, in določi jedro in sliko. (b) Ali je $f$ injektiven? (c) Pokaži, da je množica matrik z determinanto $2$ levi odsek jedra, in ga zapiši kot $A_0\,\mathrm{SL}_2(\mathbb R)$ za konkretno $A_0$.

**Podatki:** $f(A) = \det A$ na $\mathrm{GL}_2(\mathbb R)$; ciljna grupa $(\mathbb R \setminus \{0\}, \cdot)$
**Iščemo:** dokaz homomorfizma, $\ker f$, $\operatorname{im} f$, injektivnost, zapis odseka

:::formula
$\det(AB) = \det A \cdot \det B$; $\ker f = \{A : f(A) = 1\}$; $f$ injektiven natanko, ko je $\ker f$ trivialno.
:::

**Rešitev:**

1. (a) Za $A, B \in \mathrm{GL}_2$ je $f(AB) = \det(AB) = \det A \det B = f(A)f(B)$; $f$ je homomorfizem.
2. Jedro: $\ker f = \{A : \det A = 1\} = \mathrm{SL}_2(\mathbb R)$, po trditvi podgrupa.
3. Slika: za vsak $t \ne 0$ je $\det\begin{pmatrix} t & 0 \\ 0 & 1 \end{pmatrix} = t$, zato $\operatorname{im} f = \mathbb R \setminus \{0\}$.
4. (b) Matrika $\begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix} \ne I$ ima determinanto $1$, je v jedru; jedro ni trivialno, $f$ ni injektiven.
5. (c) Vzemimo $A_0 = \begin{pmatrix} 2 & 0 \\ 0 & 1 \end{pmatrix}$, $\det A_0 = 2$. Za $S \in \mathrm{SL}_2$ je $\det(A_0S) = 2 \cdot 1 = 2$, torej $A_0\,\mathrm{SL}_2 \subseteq \{B : \det B = 2\}$.
6. Obratno, če je $\det B = 2$, je $\det(A_0^{-1}B) = \frac{2}{2} = 1$, torej $S = A_0^{-1}B \in \mathrm{SL}_2$ in $B = A_0S$.
7. Odgovor: $f$ je homomorfizem z jedrom $\mathrm{SL}_2(\mathbb R)$ in sliko $\mathbb R \setminus \{0\}$, ni injektiven; matrike z determinanto $2$ so natanko odsek $A_0\,\mathrm{SL}_2(\mathbb R)$ z $A_0 = \operatorname{diag}(2, 1)$. Odseki jedra so ravno »plasti« z isto vrednostjo $f$.

### Primer 4 – zdaj ti

Permutacija $\rho \in S_7$ pošlje $1 \mapsto 3$, $2 \mapsto 5$, $3 \mapsto 1$, $4 \mapsto 6$, $5 \mapsto 2$, $6 \mapsto 7$, $7 \mapsto 4$. Zapiši jo z disjunktnimi cikli, določi red in predznak.

**Podatki:** slike $\rho$: $1 \mapsto 3$, $2 \mapsto 5$, $3 \mapsto 1$, $4 \mapsto 6$, $5 \mapsto 2$, $6 \mapsto 7$, $7 \mapsto 4$
**Iščemo:** razcep na cikle, red, $\operatorname{sgn}\rho$

:::formula
Sledi točki do vrnitve; red je $\operatorname{nzv}$ dolžin; cikel dolžine $k$ prispeva $k - 1$ transpozicij.
:::

**Rešitev:**

1. Od $1$: $1 \mapsto 3 \mapsto 1$, cikel $(1\;3)$. Od $2$: $(2\;5)$. Od $4$: $4 \mapsto 6 \mapsto 7 \mapsto 4$, cikel $(4\;6\;7)$.
2. Določi red in predznak.

:::premisli
Kolikšna sta red in predznak?
---
$\rho = (1\;3)(2\;5)(4\;6\;7)$. Red je $\operatorname{nzv}(2, 2, 3) = 6$. Transpozicij je $1 + 1 + 2 = 4$, zato je $\rho$ soda, $\operatorname{sgn}\rho = 1$.
:::

## Pogoste napake

- **Napačen vrstni red kompozituma.** $\sigma\tau$ pomeni najprej $\tau$. Kdor začne s $\sigma$, dobi $\tau\sigma$, kar je v $S_n$ navadno druga permutacija. Pred računom si zapiši dogovor.
- **Red kot vsota dolžin.** Permutacija $(1\;2\;3)(4\;5)$ nima reda $5$, ampak $\operatorname{nzv}(3, 2) = 6$. Vsota dolžin je le število premaknjenih točk.
- **Parnost po dolžini cikla.** Cikel dolžine $3$ je **soda** permutacija (dve transpoziciji). Parnost cikla je nasprotna parnosti njegove dolžine.
- **Obrat Lagrangeovega izreka.** Lagrange ne pravi, da za vsak delitelj obstaja podgrupa. $A_4$ ima $12$ elementov, a nobene podgrupe reda $6$.
- **Pozabljena zaprtost ali enota pri podgrupi.** Množica lihih celih števil ni podgrupa $(\mathbb Z, +)$: $1 + 1 = 2$ ni liho, $0$ ni v množici. Kriterij zahteva neprazno množico in $ab^{-1} \in H$.
- **$(ab)^{-1} = a^{-1}b^{-1}$.** V nekomutativni grupi je pravilno $b^{-1}a^{-1}$. Pri matrikah: $(AB)^{-1} = B^{-1}A^{-1}$.

## Povzetek

- Grupa: zaprtost, asociativnost, enota, inverzi; enota in inverzi so enolični, $(ab)^{-1} = b^{-1}a^{-1}$.
- Podgrupa: neprazna $H$ z $ab^{-1} \in H$. Lagrange: $\lvert H \rvert$ deli $\lvert G \rvert$, prek razdelitve na odseke $aH$.
- Red elementa deli red grupe; grupa praštevilskega reda je ciklična.
- $S_n$ ima $n!$ elementov; razcep na disjunktne cikle, red je $\operatorname{nzv}$ dolžin, cikel dolžine $k$ je $k - 1$ transpozicij; $A_n$ ima $\frac{n!}{2}$ elementov.
- Homomorfizem $f(ab) = f(a)f(b)$; $f(e) = e$; jedro in slika sta podgrupi; injektiven natanko pri trivialnem jedru. Primera: $\det$ z jedrom $\mathrm{SL}_n$, $\operatorname{sgn}$ z jedrom $A_n$.

## Za izpit

Znati moraš povedati:

- definicijo grupe, podgrupe, reda elementa, ciklične grupe, homomorfizma, jedra in slike,
- kriterij podgrupe z dokazom,
- Lagrangeov izrek z dokazom in posledice,
- razcep permutacije na disjunktne cikle, red in predznak permutacije,
- trditev o jedru homomorfizma z dokazom (injektivnost natanko pri trivialnem jedru).

### Naloga 1

(a) Za vsak tip razcepa na disjunktne cikle v $S_5$ določi število permutacij in njihov red. Preveri, da je vseh skupaj $120$. (b) Katere izmed teh permutacij so sode? Preveri, da jih je $60$. (c) Ali ima $S_5$ element reda $10$? Utemelji.

**Rešitev:**

1. Identiteta: $1$ permutacija, red $1$.
2. Transpozicije $(a\;b)$: $\binom52 = 10$, red $2$.
3. Dve disjunktni transpoziciji: $\frac{\binom52\binom32}{2} = \frac{10 \cdot 3}{2} = 15$, red $2$ (deljenje z $2$, ker vrstni red transpozicij ni pomemben).
4. Trojni cikli: $\binom53 \cdot 2 = 20$ (tri točke, dva cikla na njih), red $3$.
5. Trojni cikel in transpozicija: $20 \cdot 1 = 20$, red $\operatorname{nzv}(3, 2) = 6$.
6. Četverni cikli: $\binom54 \cdot 3! = 30$, red $4$.
7. Petkratni cikli: $4! = 24$, red $5$.
8. Vsota: $1 + 10 + 15 + 20 + 20 + 30 + 24 = 120$.
9. (b) Število transpozicij po tipih: $0, 1, 2, 2, 3, 3, 4$. Sode so identiteta, dvojne transpozicije, trojni in petkratni cikli: $1 + 15 + 20 + 24 = 60 = \frac{5!}{2}$.
10. (c) Red $10$ bi zahteval cikla dolžin $5$ in $2$, torej $7$ točk. V $S_5$ jih je le $5$, zato elementa reda $10$ ni (čeprav $10$ deli $120$).
11. Odgovor: redi $1, 2, 3, 4, 5, 6$ s $1, 25, 20, 30, 24, 20$ elementi; $A_5$ ima $60$ elementov; elementa reda $10$ ni. (Grupa vrtenj ikozaedra iz Primera 2 je izomorfna $A_5$: ima prav tako $15$ elementov reda $2$, $20$ reda $3$ in $24$ reda $5$.)

### Naloga 2

Natančno navedi in dokaži Lagrangeov izrek. Nato dokaži: (a) grupa praštevilskega reda $p$ je ciklična; (b) edini homomorfizem $\mathbb Z_5 \to \mathbb Z_6$ je ničelni.

**Rešitev:**

1. Izrek: če je $G$ končna grupa in $H \le G$, potem $\lvert H \rvert$ deli $\lvert G \rvert$.
2. Dokaz: preslikava $H \to aH$, $h \mapsto ah$, je bijekcija (surjektivna po definiciji, injektivna zaradi krajšanja), zato $\lvert aH \rvert = \lvert H \rvert$.
3. Če $aH \cap bH \ne \emptyset$, je $ah_1 = bh_2$, torej $a = bh_2h_1^{-1}$ in za vsak $h$ je $ah = b(h_2h_1^{-1}h) \in bH$; torej $aH \subseteq bH$, simetrično enakost.
4. Ker $a = ae \in aH$, odseki pokrijejo $G$. So paroma disjunktni in enako veliki, zato $\lvert G \rvert = k\lvert H \rvert$. $\square$
5. (a) Naj bo $\lvert G \rvert = p$ in $g \ne e$. Red $\langle g \rangle$ deli $p$ in je večji od $1$, torej je $p$. Zato $\langle g \rangle = G$.
6. (b) Naj bo $f\colon \mathbb Z_5 \to \mathbb Z_6$ homomorfizem in $x = f(1)$. Ker je v $\mathbb Z_5$ vsota petih enic enaka $0$, je $5x = f(0) = 0$ v $\mathbb Z_6$.
7. Red $x$ v $\mathbb Z_6$ deli $6$ (Lagrange) in deli $5$ (ker $5x = 0$), torej je $1$ in $x = 0$. Potem je $f(k) = kx = 0$ za vse $k$.
8. Odgovor: grupa praštevilskega reda je generirana z vsakim nenevtralnim elementom; homomorfizem $\mathbb Z_5 \to \mathbb Z_6$ je le ničelni, ker sta $5$ in $6$ tuji.

## Drugače: Na sliki

Simetrije enakostraničnega trikotnika z oglišči $1$, $2$, $3$:

```
       1
      / \
     /   \
    /  .  \
   2-------3
```

- Vrtenje za $120°$ pošlje $1 \to 2 \to 3 \to 1$: permutacija $(1\;2\;3)$; za $240°$: $(1\;3\;2)$.
- Zrcaljenje čez os skozi $1$ zamenja $2$ in $3$: $(2\;3)$; podobno $(1\;3)$ in $(1\;2)$.
- Z identiteto je to $6$ simetrij, natanko vseh $3! = 6$ permutacij oglišč. Grupa simetrij trikotnika je torej $S_3$.

Vrtenja $\{\mathrm{id}, (1\;2\;3), (1\;3\;2)\}$ tvorijo podgrupo reda $3$ (to je $A_3$), zrcaljenja so liha. Dve zrcaljenji zaporedoma data vrtenje: $(1\;2)(2\;3) = (1\;2\;3)$. Predznak tu pove, ali simetrija ohranja smer obhoda oglišč.

## Drugače: Uporaba v stroki

- **Strukturna biologija.** Pri rekonstrukciji kapsid iz posnetkov krioelektronske mikroskopije programi uporabijo ikozaedrsko grupo reda $60$: vsak posnetek šteje za $60$ posnetkov, kar izboljša ločljivost. Teorija »triangulacijskih števil« $T$ pove, da imajo ikozaedrske kapside $60T$ podenot ($T = 1, 3, 4, 7, \dots$). Beljakovina feritin iz $24$ podenot ima oktaedrsko simetrijo z grupo vrtenj reda $24$.
- **Kemija in spektroskopija.** Točkovne grupe molekul (npr. molekula vode ima $4$ simetrije) napovedo, katera nihanja so vidna v infrardečem spektru in katere orbitale se lahko mešajo.
- **Kristalografija.** $230$ prostorskih grup razvrsti vse kristalne strukture; določitev grupe je prvi korak pri rešitvi strukture beljakovine iz rentgenske difrakcije.
- **Kriptografija.** Protokol Diffie–Hellman in kriptografija z eliptičnimi krivuljami računata v velikih končnih komutativnih grupah, kjer je $g^k$ lahko izračunati, $k$ iz $g^k$ pa praktično nemogoče.

## Drugače: Bolj natančno

**Delovanje grupe.** Grupa $G$ **deluje** na množici $X$, če vsak $g$ določa bijekcijo $x \mapsto g \cdot x$ in velja $(gh) \cdot x = g \cdot (h \cdot x)$. **Izrek o tiru in stabilizatorju:** $\lvert G \rvert = \lvert G \cdot x \rvert \cdot \lvert G_x \rvert$. Za ikozaeder: tir oglišča ima $12$ elementov, stabilizator (vrtenja okoli osi skozi oglišče) $5$, zato $\lvert G \rvert = 60$, brez štetja osi.

**Edinke in kvocienti.** Podgrupa $N$ je **edinka**, če je $gNg^{-1} = N$ za vse $g$. Jedro vsakega homomorfizma je edinka; na odsekih edinke je naravna operacija $(aN)(bN) = abN$. **Prvi izrek o izomorfizmu:** $G/\ker f \cong \operatorname{im} f$; na primer $\mathrm{GL}_n/\mathrm{SL}_n \cong \mathbb R \setminus \{0\}$.

**Cayleyjev izrek.** Vsaka grupa reda $n$ je izomorfna neki podgrupi $S_n$: element $a$ permutira elemente grupe z $x \mapsto ax$. Permutacije so torej »vse« končne grupe.

## Preveri se

? Katera tabela operacije na množici $\{e, a, b\}$ določa grupo (vrstica $x$, stolpec $y$, vnos $xy$)?
- Vrstice $e{:}\ e, a, b$; $a{:}\ a, a, b$; $b{:}\ b, b, e$.
~ V vrstici $a$ se $a$ ponovi: $a \cdot e = a \cdot a$ bi s krajšanjem dalo $e = a$. V tabeli grupe je vsak element v vsaki vrstici natanko enkrat.
+ Vrstice $e{:}\ e, a, b$; $a{:}\ a, b, e$; $b{:}\ b, e, a$.
- Vrstice $e{:}\ e, a, b$; $a{:}\ a, e, e$; $b{:}\ b, e, e$.
~ Element $e$ se v vrstici $a$ ponovi dvakrat; $a$ bi imel dva inverza, kar je v grupi nemogoče.
> To je $\mathbb Z_3$ z $a = 1$, $b = 2$: vsaka vrstica in stolpec je permutacija elementov (latinski kvadrat).

? Koliko elementov ima približno simetrična grupa $S_{10}$?
- približno $100$
~ To je $10^2$; elementov je $10!$.
- približno $3600$
~ Faktoriela raste veliko hitreje.
+ približno $3{,}6$ milijona
- približno $10^{10}$
~ $10^{10}$ bi bilo število vseh preslikav $\{1, \dots, 10\} \to \{1, \dots, 10\}$, ne bijekcij.
> $10! = 3\,628\,800$.

? Zakaj grupa s $15$ elementi ne more imeti elementa reda $4$?
- Ker element reda $4$ obstaja le v grupi s $4$ elementi.
~ Grupa $\mathbb Z_8$ ima $8$ elementov in element $2$ reda $4$; red elementa mora red grupe le deliti.
+ Ker red elementa deli red grupe in $4$ ne deli $15$.
- Ker ima vsaka grupa reda $15$ le elemente reda $1$ in $15$.
~ Grupa $\mathbb Z_{15}$ ima tudi elemente reda $3$ in $5$, npr. $5$ in $3$.
- Ker grupa reda $15$ ni komutativna.
~ Grupa reda $15$ je celo vedno ciklična, torej komutativna; to s trditvijo ni povezano.
> Red $a$ je red podgrupe $\langle a \rangle$, ta po Lagrangeu deli $15$.

? Permutacija v $S_5$ ima red $6$ in je liha. Kakšen je njen razcep na disjunktne cikle?
- en cikel dolžine $6$
~ V $S_5$ je le $5$ točk; cikla dolžine $6$ ni.
+ trojni cikel in disjunktna transpozicija
- dve disjunktni transpoziciji
~ Red je $\operatorname{nzv}(2, 2) = 2$, in je soda.
- trojni cikel
~ Red je $3$ in cikel je sod.
> $\operatorname{nzv}(3, 2) = 6$, transpozicij je $2 + 1 = 3$, torej liha. To je edini tip z redom $6$ v $S_5$.

? Beljakovinska kletka (plašč) ima simetrijo kocke oziroma oktaedra; grupa vrtenj ima $24$ elementov. Plašč je iz enakih podenot, vsaka na mestu brez simetrije. Koliko podenot je v najmanjšem takem plašču?
- $8$
~ To je število oglišč kocke, ne število elementov grupe.
- $48$
~ $48$ ima grupa, ki vključuje zrcaljenja; beljakovine so kiralne, zato v plašču nastopajo le vrtenja.
+ $24$
- $12$
~ To je število robov kocke.
> Vsako vrtenje premakne podenoto na drugo mesto, zato je mest toliko kot elementov grupe: $24$ (tako je pri feritinu, ki shranjuje železo).

:::simboli
G | grupa | | | množica z operacijo
H | podgrupa | | | $H \le G$
K | ciljna grupa homomorfizma | |
e | enota (nevtralni element) | |
e_G, e_K | enota grupe $G$ oziroma $K$ | |
a, b, c, x | elementi grupe | | | inverz elementa $a$ je $a^{-1}$
h, h_1, h_2 | elementi podgrupe $H$ | |
g | generator ali poljuben element | |
k | število odsekov, eksponent ali dolžina cikla | |
p | praštevilo | |
n | stopnja simetrične grupe | |
S_n | simetrična grupa | | | $n!$ elementov
A_n | alternirajoča grupa | | | sode permutacije
\sigma, \tau, \rho | permutacije | |
f | homomorfizem | |
A, B, S | matrike | | | v Primeru 3
A_0 | predstavnik odseka | | | $\det A_0 = 2$
t | realno število, različno od nič | |
:::
