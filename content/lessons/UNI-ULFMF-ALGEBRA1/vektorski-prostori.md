---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V 19. stoletju je gimnazijski učitelj Hermann Grassmann opazil, da se s premiki, silami in še marsičim računa po istih pravilih. Sodobniki njegove knjige skoraj niso razumeli; šele Giuseppe Peano je pozneje ta pravila zbral v kratek seznam, ki mu danes rečemo aksiomi **vektorskega prostora**.

Isti vzorec srečaš sam. Če sta $x$ in $y$ rešitvi **homogenega** sistema $A\mathbf{x} = \mathbf{0}$, sta rešitvi tudi $x + y$ in vsak večkratnik $\lambda x$. Dva polinoma stopnje največ $2$ data v vsoti spet tak polinom, dve matriki $2 \times 3$ spet matriko $2 \times 3$. Na nogometnem igrišču se premika žoge pri dveh zaporednih podajah seštejeta v en sam premik, prav kot puščice v ravnini.

Izrek, dokazan enkrat za vektorski prostor, velja za vse te primere hkrati. Štirje pojmi, **podprostor**, **linearna neodvisnost**, **baza** in **dimenzija**, povedo, »kako velika« je množica rešitev sistema.

## Razlaga

Vsak razdelek spodaj se začne s predstavo, ki se zdi naravna, a vodi v napako. Ko jo popravimo, dobimo natančen pojem.

### »Vektor je puščica«

Puščica je le en primer. Pomembno ni, kako je vektor videti, ampak kaj z vektorji znamo početi. Vektorski prostor nad $\mathbb{R}$ je množica $V$, v kateri znamo vektorje seštevati ($u + v \in V$) in množiti s skalarjem ($\lambda u \in V$ za $\lambda \in \mathbb{R}$). Operaciji morata ustrezati običajnim pravilom: seštevanje je asociativno in komutativno, obstaja ničelni vektor $\mathbf{0}$, vsak $u$ ima nasprotni vektor $-u$, veljata distributivnosti in $1 \cdot u = u$.

Primeri, ki jih boš srečeval ves čas:

| Prostor | Elementi | Ničelni vektor |
|---|---|---|
| $\mathbb{R}^n$ | stolpci $(x_1, \ldots, x_n)$ | $(0, \ldots, 0)$ |
| $\mathbb{R}_n[x]$ | polinomi stopnje $\le n$ | polinom $0$ |
| $\mathbb{R}^{m \times n}$ | matrike $m \times n$ | ničelna matrika |

### »Vsaka premica je podprostor«

Premici $y = 2x$ in $y = 2x + 1$ sta vzporedni, podprostor pa je le prva. Odloča zaprtost za obe operaciji. Podmnožica $U \subseteq V$ je **vektorski podprostor**, če je neprazna in zaprta za obe operaciji: za vse $u, v \in U$ in $\lambda \in \mathbb{R}$ velja $u + v \in U$ in $\lambda u \in U$. Ekvivalentno: $\mathbf{0} \in U$ in $\alpha u + \beta v \in U$ za vse $u, v \in U$ in vse skalarje $\alpha, \beta$.

Hiter test: če $\mathbf{0} \notin U$, $U$ ni podprostor. Zato premica $y = 2x + 1$ odpade: ne gre skozi izhodišče. Premica $y = 2x$ pa test prestane in je podprostor.

Množica rešitev homogenega sistema $A\mathbf{x} = \mathbf{0}$ je vedno podprostor v $\mathbb{R}^n$. Množica rešitev nehomogenega sistema $A\mathbf{x} = \mathbf{b}$ z $\mathbf{b} \neq \mathbf{0}$ ni, saj $\mathbf{0}$ ni njena rešitev.

:::premisli
Ali je unija obeh koordinatnih osi v ravnini, $\{(x, y) : xy = 0\}$, podprostor v $\mathbb{R}^2$? Napovej, preden preveriš.
---
Ni. Vsebuje $\mathbf{0}$ in je zaprta za množenje s skalarjem, a ni zaprta za seštevanje: $(1, 0) + (0, 1) = (1, 1)$, za to točko pa $xy = 1 \neq 0$. Unija podprostorov v splošnem ni podprostor, presek pa vedno je.
:::

### »Več vektorjev pomeni večji prostor«

Kaj vse dosežemo z danimi vektorji? Vektor $\alpha_1 v_1 + \alpha_2 v_2 + \ldots + \alpha_k v_k$ je **linearna kombinacija** vektorjev $v_1, \ldots, v_k$. Množica vseh njihovih linearnih kombinacij je **linearna ogrinjača** $\mathcal{L}\{v_1, \ldots, v_k\}$. Ogrinjača je vedno podprostor. Pravimo, da vektorji $v_1, \ldots, v_k$ **napenjajo** $V$, če je $\mathcal{L}\{v_1, \ldots, v_k\} = V$.

V $\mathbb{R}^3$ je ogrinjača enega neničelnega vektorja premica skozi izhodišče. Ogrinjača dveh nevzporednih vektorjev je ravnina skozi izhodišče. Tretji vektor v isti ravnini ogrinjače ne poveča: več vektorjev še ne pomeni večjega prostora.

### »Če noben par ni vzporeden, so vektorji neodvisni«

Za dva vektorja to drži, za tri ne več: trije paroma nevzporedni vektorji lahko ležijo v isti ravnini. Pravo merilo je tole. Vektorji $v_1, \ldots, v_k$ so **linearno neodvisni**, če iz

$$\alpha_1 v_1 + \ldots + \alpha_k v_k = \mathbf{0}$$

sledi $\alpha_1 = \ldots = \alpha_k = 0$. Če obstaja netrivialna kombinacija, ki da $\mathbf{0}$, so **linearno odvisni**. Takrat je vsaj eden od njih linearna kombinacija ostalih in je »odveč«: ogrinjača se brez njega ne zmanjša.

Neodvisnost preverjaš s homogenim sistemom. Vektorje zapišeš kot stolpce matrike $A$ in rešiš $A\boldsymbol{\alpha} = \mathbf{0}$. Če ima sistem le trivialno rešitev, so neodvisni. Za $n$ vektorjev v $\mathbb{R}^n$ je to isto kot $\det A \neq 0$.

Geometrijska slika v $\mathbb{R}^3$: dva vektorja sta odvisna natanko takrat, ko sta vzporedna. Trije vektorji so odvisni natanko takrat, ko ležijo v isti ravnini skozi izhodišče.

### »Vsak nabor, ki napenja prostor, je baza«

Nabor, ki napenja, ima lahko odvečne vektorje. **Baza** prostora $V$ je zaporedje vektorjev $b_1, \ldots, b_n$, ki je linearno neodvisno in napenja $V$. Takrat lahko vsak $v \in V$ zapišemo **na en sam način** kot

$$v = \alpha_1 b_1 + \ldots + \alpha_n b_n.$$

Števila $(\alpha_1, \ldots, \alpha_n)$ so **koordinate** vektorja $v$ glede na bazo. Napenjanje zagotovi, da zapis obstaja, neodvisnost pa, da je en sam. **Standardna baza** prostora $\mathbb{R}^3$ je $e_1 = (1,0,0)$, $e_2 = (0,1,0)$, $e_3 = (0,0,1)$. Standardna baza prostora $\mathbb{R}_2[x]$ je $1, x, x^2$.

### »Dimenzija je število komponent«

Vektorji v $\mathbb{R}^4$ imajo po štiri komponente, ravnina skozi izhodišče v $\mathbb{R}^4$ pa je kljub temu dvorazsežna. Dimenzija šteje vektorje v bazi, ne komponent. Prostor ima veliko baz, a vse imajo **enako število elementov**. To število je **dimenzija** $\dim V$. Velja $\dim \mathbb{R}^n = n$, $\dim \mathbb{R}_n[x] = n + 1$ in $\dim \mathbb{R}^{m \times n} = mn$.

Podprostori v $\mathbb{R}^3$, urejeni po dimenziji:

| $\dim U$ | Kaj je $U$ | Primer baze |
|---|---|---|
| $0$ | samo $\{\mathbf{0}\}$ | prazna baza |
| $1$ | premica skozi $\mathbf{0}$ | en neničelni vektor |
| $2$ | ravnina skozi $\mathbf{0}$ | dva nevzporedna vektorja |
| $3$ | ves $\mathbb{R}^3$ | npr. $e_1, e_2, e_3$ |

V prostoru dimenzije $n$ veljata dve uporabni dejstvi. Več kot $n$ vektorjev je vedno linearno odvisnih. Natanko $n$ linearno neodvisnih vektorjev je že baza.

:::premisli
Ali lahko dva vektorja napenjata ves $\mathbb{R}^3$? Ali so lahko štirje vektorji v $\mathbb{R}^3$ linearno neodvisni? Napovej in utemelji z dimenzijo.
---
Oboje ne. Dva vektorja napenjata največ ravnino, ker je $\dim \mathcal{L}\{v_1, v_2\} \le 2 < 3$. Štirje vektorji v prostoru dimenzije $3$ so vedno odvisni, ker jih je več kot $\dim \mathbb{R}^3$. Homogeni sistem s tremi enačbami in štirimi neznankami ima vedno prosto spremenljivko.
:::

## Rešeni primeri

### Primer 1 (lažji): je to podprostor?

V $\mathbb{R}^3$ sta dani množici $U = \{(x, y, z) : x - 2y + z = 0\}$ in $W = \{(x, y, z) : x - 2y + z = 1\}$. Ali sta podprostora?

**Podatki:** $U$ je množica rešitev enačbe $x - 2y + z = 0$, $W$ množica rešitev enačbe $x - 2y + z = 1$, obe v $\mathbb{R}^3$.
**Iščemo:** ali je $U$ podprostor, ali je $W$ podprostor.

:::formula
$U$ je podprostor, če $\mathbf{0} \in U$ in za $u, v \in U$, $\alpha, \beta \in \mathbb{R}$ velja $\alpha u + \beta v \in U$.
:::

**Rešitev:**

1. Za $U$: $\mathbf{0} = (0,0,0)$ izpolni $0 - 0 + 0 = 0$, torej $\mathbf{0} \in U$.
2. Naj bosta $u = (x_1, y_1, z_1)$ in $v = (x_2, y_2, z_2)$ v $U$. Za $\alpha u + \beta v$ dobimo $(\alpha x_1 + \beta x_2) - 2(\alpha y_1 + \beta y_2) + (\alpha z_1 + \beta z_2) = \alpha(x_1 - 2y_1 + z_1) + \beta(x_2 - 2y_2 + z_2) = \alpha \cdot 0 + \beta \cdot 0 = 0$, ker $u$ in $v$ izpolnjujeta enačbo za $U$.
3. Torej $\alpha u + \beta v \in U$ in $U$ je podprostor. Geometrijsko je to ravnina skozi izhodišče.
4. Za $W$: vstavimo $\mathbf{0}$ in dobimo $0 \neq 1$, zato $\mathbf{0} \notin W$.
5. Odgovor: $U$ je podprostor, $W$ ni. $W$ je ravnina, vzporedna $U$, ki ne gre skozi izhodišče.

### Primer 2: so vektorji neodvisni?

Dron, ki snema košarkarsko tekmo, ima tri osnovne ukaze za premik (v metrih vzdolž igrišča, čez igrišče in navzgor): $v_1 = (1, 2, 1)$, $v_2 = (2, 1, 0)$, $v_3 = (1, -1, -1)$. Pilot bi z njihovimi kombinacijami rad dosegel vsako točko nad igriščem. Ali so ti vektorji v $\mathbb{R}^3$ linearno neodvisni? Če niso, poišči netrivialno kombinacijo, ki da $\mathbf{0}$.

**Podatki:** $v_1 = (1, 2, 1)$, $v_2 = (2, 1, 0)$, $v_3 = (1, -1, -1)$
**Iščemo:** ali so neodvisni; sicer zvezo med njimi.

:::formula
Trije vektorji v $\mathbb{R}^3$ so neodvisni $\iff \det\begin{bmatrix} v_1 & v_2 & v_3 \end{bmatrix} \neq 0$.
:::

**Rešitev:**

1. Vektorje zapišemo kot vrstice (determinanta se pri transponiranju ne spremeni):
$$\det\begin{bmatrix} 1 & 2 & 1 \\ 2 & 1 & 0 \\ 1 & -1 & -1 \end{bmatrix}$$
2. Razvoj po prvi vrstici: $1 \cdot (-1 - 0) - 2 \cdot (-2 - 0) + 1 \cdot (-2 - 1)$.
3. To je $-1 + 4 - 3 = 0$, zato so vektorji linearno odvisni.
4. Iščemo zvezo. Opazimo $v_2 - v_1 = (2 - 1,\ 1 - 2,\ 0 - 1) = (1, -1, -1) = v_3$.
5. Odgovor: vektorji so odvisni, velja $v_1 - v_2 + v_3 = \mathbf{0}$. Noben par ni vzporeden, a vsi trije ležijo v isti ravnini, zato je $\dim \mathcal{L}\{v_1, v_2, v_3\} = 2$. Dron s temi ukazi ostane v eni ravnini in ne doseže vsake točke nad igriščem.

### Primer 3 (težji): baza in dimenzija množice rešitev

Poišči bazo in dimenzijo podprostora $U = \{(x, y, z, w) \in \mathbb{R}^4 : x + y - z = 0,\ y - 2z + w = 0\}$.

**Podatki:** $U \subseteq \mathbb{R}^4$, enačbi $x + y - z = 0$ in $y - 2z + w = 0$
**Iščemo:** bazo $U$ in $\dim U$

:::formula
Rešimo homogeni sistem, splošno rešitev zapišemo kot linearno kombinacijo s prostimi spremenljivkami; vektorji ob njih tvorijo bazo.
:::

**Rešitev:**

1. Sistem je že stopničast. Vodilni neznanki sta $x$ in $y$, prosti sta $z$ in $w$.
2. Iz druge enačbe: $y = 2z - w$.
3. Iz prve: $x = z - y = z - (2z - w) = -z + w$.
4. Splošna rešitev: $(x, y, z, w) = z\,(-1, 2, 1, 0) + w\,(1, -1, 0, 1)$.
5. Vektorja $b_1 = (-1, 2, 1, 0)$ in $b_2 = (1, -1, 0, 1)$ napenjata $U$. Neodvisna sta: iz $\alpha b_1 + \beta b_2 = \mathbf{0}$ tretja komponenta da $\alpha = 0$, četrta pa $\beta = 0$.
6. Preizkus za $b_1$: $-1 + 2 - 1 = 0$ in $2 - 2 + 0 = 0$. Za $b_2$: $1 - 1 - 0 = 0$ in $-1 - 0 + 1 = 0$.
7. Odgovor: baza je $\{(-1, 2, 1, 0),\ (1, -1, 0, 1)\}$, $\dim U = 2$. Vektorji imajo sicer $4$ komponente, a $U$ je »ravnina« v $\mathbb{R}^4$.

### Primer 4: zdaj ti

Ali polinomi $p_1 = 1 + x$, $p_2 = x + x^2$, $p_3 = 1 + x^2$ tvorijo bazo prostora $\mathbb{R}_2[x]$? Če jo, poišči koordinate polinoma $q = 2 + 3x + x^2$ v tej bazi.

**Podatki:** $p_1 = 1 + x$, $p_2 = x + x^2$, $p_3 = 1 + x^2$, $q = 2 + 3x + x^2$, $\dim \mathbb{R}_2[x] = 3$
**Iščemo:** ali je $\{p_1, p_2, p_3\}$ baza; koordinate $(a, b, c)$ polinoma $q$

:::formula
Polinom $c_0 + c_1 x + c_2 x^2$ zapišemo s koordinatami $(c_0, c_1, c_2)$ v standardni bazi. Trije neodvisni vektorji v prostoru dimenzije $3$ tvorijo bazo.
:::

**Rešitev:**

1. Koordinate v standardni bazi: $p_1 \to (1, 1, 0)$, $p_2 \to (0, 1, 1)$, $p_3 \to (1, 0, 1)$.
2. $\det\begin{bmatrix} 1 & 1 & 0 \\ 0 & 1 & 1 \\ 1 & 0 & 1 \end{bmatrix} = 1 \cdot (1 - 0) - 1 \cdot (0 - 1) + 0 = 2 \neq 0$, torej so neodvisni.
3. Ker so trije in $\dim \mathbb{R}_2[x] = 3$, tvorijo bazo.
4. Iz $a\,p_1 + b\,p_2 + c\,p_3 = q$ primerjamo koeficiente pri $1$, $x$ in $x^2$: $a + c = 2$, $a + b = 3$, $b + c = 1$.
5. Reši sistem sam, nato preveri:

:::premisli
Koliko so $a$, $b$ in $c$?
---
Seštejemo vse tri enačbe: $2(a + b + c) = 6$, torej $a + b + c = 3$. Od tega odštejemo vsako enačbo: $b = 1$, $c = 0$, $a = 2$. Koordinate so $(2, 1, 0)$, res $q = 2p_1 + p_2$.
:::

## Pogoste napake

- **Vsaka ravnina je podprostor.** Študent vidi »ravnino« in sklene, da je podprostor. Napaka: ravnina $x - 2y + z = 1$ ne vsebuje $\mathbf{0}$. Popravek: najprej preveri, ali je $\mathbf{0}$ v množici; podprostori v $\mathbb{R}^n$ so samo premice, ravnine itd. **skozi izhodišče**.
- **Paroma nevzporedni pomeni neodvisni.** Pri treh ali več vektorjih to ne zadošča: v primeru 2 noben par ni vzporeden, pa so vsi trije odvisni, ker ležijo v isti ravnini. Popravek: reši homogeni sistem ali izračunaj determinanto za vse vektorje hkrati.
- **Dimenzija je število komponent.** »Vektorji imajo $4$ komponente, torej je $\dim U = 4$.« Napaka: število komponent je dimenzija okoliškega prostora. Popravek: $\dim U$ je število vektorjev v bazi $U$; pri množici rešitev je to število prostih spremenljivk.
- **Unija podprostorov je podprostor.** Unija dveh premic skozi izhodišče ni zaprta za seštevanje. Popravek: presek podprostorov je podprostor, unija pa le, če je eden vsebovan v drugem.
- **Množica, ki napenja, je že baza.** Vektorji $v_1, v_2, v_3$ iz primera 2 napenjajo ravnino, a niso baza, ker je eden odveč. Popravek: baza mora prostor napenjati **in** biti neodvisna.

## Povzetek

- Vektorski prostor je množica, kjer znamo seštevati in množiti s skalarjem po običajnih pravilih ($\mathbb{R}^n$, $\mathbb{R}_n[x]$, matrike).
- Podprostor vsebuje $\mathbf{0}$ in je zaprt za linearne kombinacije. Množica rešitev $A\mathbf{x} = \mathbf{0}$ je podprostor.
- Vektorji so linearno neodvisni, če le trivialna kombinacija da $\mathbf{0}$; preverimo s homogenim sistemom ali determinanto.
- Baza je neodvisna množica, ki napenja prostor; koordinate glede na bazo so enolične.
- Dimenzija je število vektorjev v bazi: $\dim \mathbb{R}^n = n$, $\dim \mathbb{R}_n[x] = n + 1$. Pri množici rešitev je enaka številu prostih spremenljivk.

## Drugače: Na sliki

Predstavljaj si $\mathbb{R}^3$ kot sobo z izhodiščem v kotu.

- En neničelni vektor je palica iz kota. Vsi njeni raztegi in obrati v nasprotno smer dajo **premico** skozi kot: podprostor dimenzije $1$.
- Dodaš drugo palico, ki ne leži na isti premici. Vse kombinacije prekrijejo **ravnino** skozi kot, npr. tla sobe: dimenzija $2$.
- Tretja palica, ki štrli iz tal, prinese ves prostor: dimenzija $3$.
- Če tretja palica leži na tleh, ne prinese ničesar novega. To je linearna odvisnost: ogrinjača ostane ravnina.

Vsaka nova neodvisna smer poveča dimenzijo za $1$. Baza je najmanjši nabor palic, s katerimi dosežeš vsako točko sobe.

## Drugače: Korak za korakom s številkami

Postopek za vektorje $v_1, \ldots, v_k \in \mathbb{R}^n$:

1. Vektorje zapiši kot **vrstice** matrike.
2. Z Gaussovo eliminacijo jo preoblikuj v stopničasto obliko. Vrstične operacije ne spremenijo ogrinjače vrstic.
3. Preštej neničelne vrstice. To število je **rang** in je enako $\dim \mathcal{L}\{v_1, \ldots, v_k\}$.
4. Če je rang enak $k$, so vektorji neodvisni. Če je manjši, so odvisni.
5. Neničelne vrstice stopničaste oblike so baza ogrinjače.

Za primer 2: iz vrstic $(1,2,1)$, $(2,1,0)$, $(1,-1,-1)$ z $V_2 - 2V_1$ in $V_3 - V_1$ dobimo $(0,-3,-2)$ in $(0,-3,-2)$. Po odštetju je tretja vrstica ničelna. Rang je $2$, vektorji so odvisni, ogrinjača je ravnina z bazo $(1,2,1)$, $(0,-3,-2)$.

## Drugače: Bolj natančno

**Lema o zamenjavi (Steinitz).** Če $u_1, \ldots, u_m$ napenjajo $V$ in so $w_1, \ldots, w_k \in V$ linearno neodvisni, je $k \le m$.

*Skica dokaza.* Ker $u_i$ napenjajo $V$, je $w_1 = \sum \alpha_i u_i$ in vsaj en $\alpha_i \neq 0$, sicer bi bil $w_1 = \mathbf{0}$. Ta $u_i$ izrazimo z $w_1$ in ostalimi $u_j$ ter ga zamenjamo z $w_1$; nova množica še vedno napenja $V$. Postopek ponovimo z $w_2, w_3, \ldots$. Neodvisnost $w$-jev zagotovi, da vsakič zamenjamo enega od preostalih $u$-jev, ne že vstavljenega $w$. Če bi bilo $k > m$, bi po $m$ korakih $w_1, \ldots, w_m$ napenjali $V$, torej bi bil $w_{m+1}$ njihova kombinacija, kar nasprotuje neodvisnosti.

**Posledica.** Če sta $\{b_1, \ldots, b_n\}$ in $\{c_1, \ldots, c_m\}$ bazi, uporabimo lemo v obe smeri: $m \le n$ in $n \le m$. Torej je dimenzija dobro definirana.

**Enoličnost koordinat.** Iz $\sum \alpha_i b_i = \sum \beta_i b_i$ sledi $\sum (\alpha_i - \beta_i) b_i = \mathbf{0}$ in zaradi neodvisnosti $\alpha_i = \beta_i$ za vse $i$.

**Dopolnitev do baze.** Vsako neodvisno množico v končnorazsežnem prostoru lahko dopolnimo do baze. Iz vsake končne množice, ki napenja $V$, lahko izberemo bazo. Za podprostor $U \subseteq V$ zato velja $\dim U \le \dim V$, enakost pa natanko tedaj, ko je $U = V$.

Obstajajo tudi neskončnorazsežni prostori, npr. prostor vseh polinomov $\mathbb{R}[x]$: polinomi $1, x, x^2, \ldots$ so neodvisni za vsako število členov.

## Preveri se

? Kaj je baza vektorskega prostora $V$?
- Katerakoli množica vektorjev, ki napenja $V$.
~ Množica, ki napenja, ima lahko odvečne vektorje. Baza mora biti tudi linearno neodvisna.
+ Linearno neodvisna množica vektorjev, ki napenja $V$.
- Katerakoli linearno neodvisna množica vektorjev v $V$.
~ Neodvisna množica je lahko premajhna, npr. en vektor v $\mathbb{R}^3$. Baza mora tudi napenjati $V$.
> Napenjanje zagotovi, da se vsak vektor da zapisati, neodvisnost pa, da je zapis en sam.

? Ali je $U = \{(x, y) \in \mathbb{R}^2 : y = 2x + 1\}$ podprostor v $\mathbb{R}^2$?
- Da, ker je premica.
~ Podprostori v $\mathbb{R}^2$ so le premice **skozi izhodišče**. Ta premica gre skozi $(0, 1)$.
+ Ne, ker ne vsebuje ničelnega vektorja.
- Da, ker je množica rešitev linearne enačbe.
~ Podprostor je množica rešitev **homogene** enačbe. Tu je desna stran po preureditvi $1 \neq 0$.
> Za $(0, 0)$ dobimo $0 = 2 \cdot 0 + 1 = 1$, kar ne drži. Brez $\mathbf{0}$ množica ne more biti podprostor.

? Vektorji $u, v, w \in \mathbb{R}^3$ so paroma nevzporedni. Kaj lahko zagotovo trdimo?
- So linearno neodvisni.
~ Trije paroma nevzporedni vektorji lahko ležijo v isti ravnini, kot v primeru 2.
- So linearno odvisni.
~ Lahko so tudi neodvisni, npr. $e_1, e_2, e_3$. Iz nevzporednosti parov odvisnosti ne moremo sklepati.
+ Njihova ogrinjača ima dimenzijo vsaj $2$.
> Že dva nevzporedna vektorja napenjata ravnino, zato je $\dim \mathcal{L}\{u, v, w\} \ge 2$. Ali je $3$, pove šele determinanta.

? Kolikšna je dimenzija podprostora $U = \{(x, y, z) \in \mathbb{R}^3 : x + y + z = 0\}$?
- $3$
~ $3$ je število komponent, torej $\dim \mathbb{R}^3$. $U$ je pravi podprostor, zato ima manjšo dimenzijo.
- $1$
~ $1$ je število enačb. Dimenzija je število prostih spremenljivk: $3 - 1$.
+ $2$
> Iz $x = -y - z$ sta $y$ in $z$ prosti. Baza je $(-1, 1, 0)$, $(-1, 0, 1)$, torej $\dim U = 2$.

? Za kateri $a$ so vektorji $(1, 1, 0)$, $(0, 1, a)$, $(1, 0, 1)$ linearno odvisni?
- Za noben $a$, ker noben par ni vzporeden.
~ Nevzporedni pari ne zagotovijo neodvisnosti treh vektorjev. Izračunaj determinanto.
- $a = 0$
~ Pri $a = 0$ je determinanta $1 \neq 0$. Ničla v vektorju še ne pomeni odvisnosti.
+ $a = -1$
- $a = 1$
~ Pri $a = 1$ je determinanta $2$. Verjetno si pri razvoju zamenjal predznak drugega člena.
> $\det = 1 \cdot (1 - 0) - 1 \cdot (0 - a) + 0 = 1 + a$, kar je $0$ pri $a = -1$. Takrat velja $(1,1,0) - (0,1,-1) = (1,0,1)$.

:::simboli
\alpha, \beta | skalarja (koeficienta linearne kombinacije) | | | α₁, …, αₙ so koordinate vektorja v bazi
v | vektor prostora V | v = \alpha_1 b_1 + \ldots + \alpha_n b_n
v_1, v_2, v_3, v_k | vektorji linearne kombinacije
b_1, b_n | vektorji baze prostora V
U | vektorski podprostor prostora V
u | vektor podprostora U
c_0, c_1, c_2 | koeficienti polinoma (koordinate v standardni bazi)
x | spremenljivka polinoma | | | x, y tudi rešitvi homogenega sistema
:::
