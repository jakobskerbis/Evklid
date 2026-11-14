---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Postavi se v kot učilnice. Tla so ravnina, steni sta ravnini, rob med stenama je premica. Laserski žarek iz kazalnika je premica, ki zadene steno v eni točki. Vprašanja so konkretna: kje žarek zadene steno, pod kolikšnim kotom, kako daleč je luč na stropu od tal, ali se dva ravna kabla pod stropom dotikata?

V ravnini že poznaš premico $ax + by = c$. V prostoru pa ista oblika z eno spremenljivko več, $ax + by + cz = d$, ne opisuje premice, ampak **ravnino**. Za premico potrebujemo drug zapis. Z vektorji, skalarnim in vektorskim produktom bomo vse te naloge rešili po enotnem receptu. Enako geometrijo kasneje srečaš pri sistemih linearnih enačb: vsaka enačba s tremi neznankami je ena ravnina.

## Razlaga

**1. Premica.** Premico določata točka $A$ na njej in **smerni vektor** $\vec e \ne \vec 0$, ki kaže vzdolž premice. Točko $T$ dosežeš tako, da od $A$ greš $t$-krat vzdolž $\vec e$. Krajevni vektorji točk premice so

$$\vec r = \vec r_A + t\,\vec e, \qquad t \in \mathbb{R}.$$

To je **parametrična enačba**. Po komponentah, z $A(x_0, y_0, z_0)$ in $\vec e = (e_1, e_2, e_3)$:

$$x = x_0 + t e_1,\quad y = y_0 + t e_2,\quad z = z_0 + t e_3.$$

Če iz vseh treh izrazimo $t$, dobimo **kanonično enačbo** $\dfrac{x - x_0}{e_1} = \dfrac{y - y_0}{e_2} = \dfrac{z - z_0}{e_3}$. Če je kakšna komponenta $e_i = 0$, ustrezna koordinata ostane stalna. Primer: premica skozi $A(1, 2, 3)$ s smerjo $(2, -1, 4)$ ima kanonično enačbo $\frac{x - 1}{2} = \frac{y - 2}{-1} = \frac{z - 3}{4}$.

**2. Ravnina.** Ravnino določata točka $A$ in **normala** $\vec n = (a, b, c) \ne \vec 0$, vektor, pravokoten na ravnino. Točka $T$ leži v ravnini natanko tedaj, ko je $\overrightarrow{AT}$ pravokoten na $\vec n$, torej $\vec n \cdot (\vec r - \vec r_A) = 0$. Razpisano:

$$ax + by + cz = d, \qquad d = \vec n \cdot \vec r_A.$$

To je **splošna enačba ravnine**. Koeficienti pri $x$, $y$, $z$ so normala, kar lahko kar prebereš. Ravnino skozi tri nekolinearne točke $A$, $B$, $C$ dobiš z normalo $\vec n = \overrightarrow{AB} \times \overrightarrow{AC}$, ker je vektorski produkt pravokoten na oba vektorja v ravnini. Ravnino lahko zapišeš tudi parametrično, $\vec r = \vec r_A + s\,\vec u + t\,\vec v$, kjer sta $\vec u$, $\vec v$ linearno neodvisna vektorja v ravnini.

:::premisli
Kaj v prostoru opisuje enačba $z = 0$? In kaj enačba $x = 2$? Napovej s pomočjo kota učilnice.
---
$z = 0$ so tla (ravnina $xy$), normala $(0, 0, 1)$ kaže navpično. $x = 2$ je ravnina z normalo $(1, 0, 0)$, vzporedna s steno $x = 0$ in od nje oddaljena $2$. V prostoru ena linearna enačba vzame le eno prostostno stopnjo od treh, zato ostaneta dve: ravnina.
:::

**3. Medsebojna lega.** Vse odločitve gredo prek dveh vprašanj: sta smerna vektorja (ali normali) vzporedna in ali imata objekta skupno točko?

*Dve premici* $\vec r = \vec r_A + t\,\vec e_1$ in $\vec r = \vec r_B + s\,\vec e_2$:

| $\vec e_1 \parallel \vec e_2$? | skupna točka? | lega |
|---|---|---|
| da | da | sovpadata |
| da | ne | vzporedni |
| ne | da | sekata se |
| ne | ne | mimobežni |

**Mimobežni** premici nista vzporedni in se ne sekata. V ravnini jih ni, v prostoru pa so pogoste: rob tal ob eni steni in navpični rob na nasprotni strani sobe. Hiter test: nevzporedni premici se sekata natanko tedaj, ko je $(\vec r_B - \vec r_A) \cdot (\vec e_1 \times \vec e_2) = 0$, torej ko $\overrightarrow{AB}$, $\vec e_1$, $\vec e_2$ ležijo v isti ravnini.

*Premica in ravnina* $ax + by + cz = d$: če je $\vec e \cdot \vec n \ne 0$, premica seka ravnino v eni točki. Vstavi $x, y, z$ iz parametrične enačbe v enačbo ravnine in reši na $t$. Če je $\vec e \cdot \vec n = 0$, je premica vzporedna z ravnino. Če $A$ leži v ravnini, leži v njej vsa premica.

*Dve ravnini* z normalama $\vec n_1$, $\vec n_2$: če $\vec n_1 \parallel \vec n_2$, sta ravnini vzporedni ali sovpadata. Sicer se sekata v premici s smernim vektorjem $\vec n_1 \times \vec n_2$.

:::premisli
Ali se lahko dve ravnini v prostoru sekata v eni sami točki? Zakaj?
---
Ne. Če imata skupno točko $T$ in nista vzporedni, je vektor $\vec n_1 \times \vec n_2$ pravokoten na obe normali, torej leži v obeh ravninah. Cela premica skozi $T$ v tej smeri je skupna. Ravnini se zato sekata v premici ali pa sploh ne (ali sovpadata).
:::

**4. Razdalje.** Razdalja je vedno dolžina najkrajše, pravokotne povezave.

- *Točka $T(x_1, y_1, z_1)$ od ravnine:* vstavi $T$ v levo stran in deli z dolžino normale:
$$\delta = \frac{|a x_1 + b y_1 + c z_1 - d|}{\sqrt{a^2 + b^2 + c^2}}.$$
- *Točka $T$ od premice:* paralelogram z robovoma $\overrightarrow{AT}$ in $\vec e$ ima ploščino $|\overrightarrow{AT} \times \vec e|$; višina na osnovnico $|\vec e|$ je
$$\delta = \frac{|\overrightarrow{AT} \times \vec e|}{|\vec e|}.$$
- *Mimobežni premici:* paralelepiped z robovi $\overrightarrow{AB}$, $\vec e_1$, $\vec e_2$ ima prostornino $|\overrightarrow{AB} \cdot (\vec e_1 \times \vec e_2)|$; višina je
$$\delta = \frac{|\overrightarrow{AB} \cdot (\vec e_1 \times \vec e_2)|}{|\vec e_1 \times \vec e_2|}.$$
- *Vzporedni ravnini ali premica, vzporedna z ravnino:* vzemi eno točko in izračunaj njeno razdaljo od drugega objekta.

**5. Koti.** Kot $\varphi$ je vedno med $0^\circ$ in $90^\circ$, zato v števcu pišemo absolutno vrednost.

- Med premicama: $\cos\varphi = \dfrac{|\vec e_1 \cdot \vec e_2|}{|\vec e_1|\,|\vec e_2|}$.
- Med ravninama: enako, z normalama $\vec n_1$, $\vec n_2$.
- Med premico in ravnino: normala je pravokotna na ravnino, zato kot med $\vec e$ in $\vec n$ dopolnjuje iskani kot do $90^\circ$. Zato $\sin\varphi = \dfrac{|\vec e \cdot \vec n|}{|\vec e|\,|\vec n|}$.

## Rešeni primeri

### Primer 1 (lažji): ravnina skozi tri točke

Zapiši enačbo ravnine skozi točke $A(1, 0, 0)$, $B(0, 2, 0)$ in $C(0, 0, 3)$.

**Podatki:** $A(1, 0, 0)$, $B(0, 2, 0)$, $C(0, 0, 3)$
**Iščemo:** enačbo ravnine $ax + by + cz = d$

:::formula
$\vec n = \overrightarrow{AB} \times \overrightarrow{AC}$, nato $d = \vec n \cdot \vec r_A$
:::

**Rešitev:**

1. Vektorja v ravnini: $\overrightarrow{AB} = (-1, 2, 0)$, $\overrightarrow{AC} = (-1, 0, 3)$.
2. Normala: $\vec n = \big(2 \cdot 3 - 0 \cdot 0,\ 0 \cdot (-1) - (-1) \cdot 3,\ (-1) \cdot 0 - 2 \cdot (-1)\big) = (6, 3, 2)$.
3. $d = \vec n \cdot \vec r_A = 6 \cdot 1 + 3 \cdot 0 + 2 \cdot 0 = 6$.
4. Preverimo z $B$ in $C$: $3 \cdot 2 = 6$ in $2 \cdot 3 = 6$, obe točki ustrezata.
5. Odgovor: ravnina ima enačbo $6x + 3y + 2z = 6$.

### Primer 2: kje in pod kolikšnim kotom žarek zadene steno

Laserski žarek gre iz točke $P(1, 0, -1)$ v smeri $\vec e = (2, 1, 2)$. Stena leži v ravnini $\Sigma\colon x + 2y + 2z = 15$. Kje žarek zadene steno in pod kolikšnim kotom?

**Podatki:** $P(1, 0, -1)$, $\vec e = (2, 1, 2)$, $\Sigma\colon x + 2y + 2z = 15$, torej $\vec n = (1, 2, 2)$
**Iščemo:** presečišče $Q$ in kot $\varphi$ med premico in ravnino

:::formula
Premica: $x = 1 + 2t$, $y = t$, $z = -1 + 2t$; vstavi v $\Sigma$. Kot: $\sin\varphi = \dfrac{|\vec e \cdot \vec n|}{|\vec e|\,|\vec n|}$.
:::

**Rešitev:**

1. Najprej $\vec e \cdot \vec n = 2 + 2 + 4 = 8 \ne 0$, zato žarek steno res seka.
2. Vstavimo: $(1 + 2t) + 2t + 2(-1 + 2t) = 15$, torej $-1 + 8t = 15$ in $t = 2$.
3. Presečišče: $Q = (1 + 4,\ 0 + 2,\ -1 + 4) = (5, 2, 3)$. Preverimo: $5 + 4 + 6 = 15$.
4. Dolžini: $|\vec e| = \sqrt{4 + 1 + 4} = 3$, $|\vec n| = \sqrt{1 + 4 + 4} = 3$.
5. $\sin\varphi = \dfrac{8}{3 \cdot 3} = \dfrac{8}{9}$, zato $\varphi \approx 62{,}7^\circ$. Sinus, ker $\vec n$ stoji pravokotno na steno.
6. Odgovor: žarek zadene steno v točki $Q(5, 2, 3)$ pod kotom približno $62{,}7^\circ$.

### Primer 3 (težji): ali se kabla dotikata?

Pod stropom hale sta napeljana dva ravna kabla. Prvi gre skozi $A(0, 0, 0)$ v smeri $\vec e_1 = (1, 1, 0)$, drugi skozi $B(1, 0, 2)$ v smeri $\vec e_2 = (0, 1, 1)$. Koordinate so v metrih. Ali se kabla dotikata? Kolikšna je najmanjša razdalja med njima?

**Podatki:** $A(0, 0, 0)$, $\vec e_1 = (1, 1, 0)$, $B(1, 0, 2)$, $\vec e_2 = (0, 1, 1)$, enota $1\,\mathrm{m}$
**Iščemo:** medsebojno lego premic in razdaljo $\delta$

:::formula
$$\delta = \frac{|\overrightarrow{AB} \cdot (\vec e_1 \times \vec e_2)|}{|\vec e_1 \times \vec e_2|}$$
:::

**Rešitev:**

1. Smerna vektorja nista vzporedna: vsak večkratnik $(1, 1, 0)$ ima tretjo komponento $0$, $(0, 1, 1)$ pa ne.
2. Vektorski produkt: $\vec e_1 \times \vec e_2 = (1 \cdot 1 - 0 \cdot 1,\ 0 \cdot 0 - 1 \cdot 1,\ 1 \cdot 1 - 1 \cdot 0) = (1, -1, 1)$.
3. $\overrightarrow{AB} = (1, 0, 2)$ in $\overrightarrow{AB} \cdot (1, -1, 1) = 1 - 0 + 2 = 3 \ne 0$. Premici nista v isti ravnini, torej sta mimobežni.
4. $|\vec e_1 \times \vec e_2| = \sqrt{1 + 1 + 1} = \sqrt{3}$.
5. $\delta = \dfrac{3}{\sqrt{3}} = \sqrt{3} \approx 1{,}73$.
6. Odgovor: kabla se ne dotikata (mimobežna sta), najmanjša razdalja med njima je $\sqrt{3}\,\mathrm{m} \approx 1{,}73\,\mathrm{m}$.

### Primer 4: zdaj ti

Ravnini $\Sigma_1\colon 2x - y + 2z = 3$ in $\Sigma_2\colon 2x - y + 2z = 12$ omejujeta ploščo. Kolikšna je debelina plošče, torej razdalja med ravninama?

**Podatki:** $\Sigma_1\colon 2x - y + 2z = 3$, $\Sigma_2\colon 2x - y + 2z = 12$
**Iščemo:** razdaljo $\delta$ med ravninama

:::formula
Vzemi točko $T \in \Sigma_1$ in izračunaj $\delta = \dfrac{|2x_1 - y_1 + 2z_1 - 12|}{\sqrt{2^2 + 1^2 + 2^2}}$.
:::

**Rešitev:**

1. Normali sta enaki, $\vec n = (2, -1, 2)$, desni strani različni: ravnini sta vzporedni.
2. Točka na $\Sigma_1$: postavi $x = z = 0$, dobiš $-y = 3$, torej $T(0, -3, 0)$.
3. Dolžina normale: $|\vec n| = \sqrt{4 + 1 + 4} = 3$.
4. Izračunaj razdaljo točke $T$ od $\Sigma_2$ sam.

:::premisli
Koliko je razdalja?
---
$\delta = \dfrac{|0 + 3 + 0 - 12|}{3} = \dfrac{9}{3} = 3$. Plošča je debela $3$ enote. Hitreje: pri enakih normalah je $\delta = \frac{|d_2 - d_1|}{|\vec n|}$.
:::

## Pogoste napake

- **»$ax + by + cz = d$ je premica.«** Navada iz ravnine. V prostoru ena enačba določi ravnino. Popravek: premico zapiši parametrično ali kot presek dveh ravnin (dve enačbi).
- **»Smerna vektorja nista vzporedna, torej se premici sekata.«** Tako sklepaš, ker v ravnini drugih možnosti ni. V prostoru sta lahko mimobežni. Popravek: preveri še $\overrightarrow{AB} \cdot (\vec e_1 \times \vec e_2) = 0$.
- **Kot med premico in ravnino s kosinusom.** Kosinus med $\vec e$ in $\vec n$ da kot med premico in **normalo**, torej $90^\circ - \varphi$. Popravek: uporabi $\sin\varphi$. Pri dveh premicah ali dveh ravninah pa kosinus.
- **Razdalja brez deljenja z $|\vec n|$.** Vstaviš točko v enačbo, dobiš $-3$ in misliš, da je razdalja $3$ ali celo $-3$. Vrednost $ax_1 + by_1 + cz_1 - d$ je razdalja le, če je $|\vec n| = 1$. Popravek: absolutna vrednost in deljenje z $\sqrt{a^2 + b^2 + c^2}$.
- **Isti parameter pri dveh premicah.** Pri iskanju presečišča pišeš $\vec r_A + t\,\vec e_1 = \vec r_B + t\,\vec e_2$. To zahteva, da obe »prideta« v točko ob istem $t$, kar ni potrebno. Popravek: vzemi različna parametra $t$ in $s$.

## Povzetek

- Premica: $\vec r = \vec r_A + t\,\vec e$ (parametrična), kanonična $\frac{x - x_0}{e_1} = \frac{y - y_0}{e_2} = \frac{z - z_0}{e_3}$.
- Ravnina: $ax + by + cz = d$ z normalo $\vec n = (a, b, c)$; skozi tri točke $\vec n = \overrightarrow{AB} \times \overrightarrow{AC}$.
- Premici: sovpadata, vzporedni, sekata se ali mimobežni; nevzporedni se sekata $\iff \overrightarrow{AB} \cdot (\vec e_1 \times \vec e_2) = 0$.
- Premica in ravnina: $\vec e \cdot \vec n \ne 0$ seka (vstavi in reši na $t$), sicer vzporedna ali leži v njej. Dve ravnini: vzporedni ali presečnica s smerjo $\vec n_1 \times \vec n_2$.
- Razdalje: točka–ravnina $\frac{|ax_1 + by_1 + cz_1 - d|}{|\vec n|}$, točka–premica $\frac{|\overrightarrow{AT} \times \vec e|}{|\vec e|}$, mimobežnici $\frac{|\overrightarrow{AB} \cdot (\vec e_1 \times \vec e_2)|}{|\vec e_1 \times \vec e_2|}$.
- Koti v $[0^\circ, 90^\circ]$: med premicama in med ravninama $\cos$, med premico in ravnino $\sin$.

## Drugače: Na sliki (kot učilnice)

Postavi izhodišče v kot sobe: os $x$ gre vzdolž ene stene, os $y$ vzdolž druge, os $z$ navpično.

- Tla: $z = 0$, normala $(0, 0, 1)$ kaže v strop.
- Stena za tabo: $x = 0$, normala $(1, 0, 0)$.
- Rob med stenama je presek ravnin $x = 0$ in $y = 0$: os $z$, smer $(1, 0, 0) \times (0, 1, 0) = (0, 0, 1)$.
- Rob tal ob steni $x = 0$ (os $y$) in navpični rob v nasprotnem kotu sobe sta mimobežna: nista vzporedna in se nikoli ne srečata.
- Luč na stropu na višini $3$ je od tal oddaljena $3$: vstaviš v $z = 0$ in deliš z $|\vec n| = 1$.

Kot med premico in ravnino si predstavljaj kot palico, prislonjeno na tla. Normala stoji pokonci. Kot palice s tlemi in kot palice z normalo skupaj data $90^\circ$.

## Drugače: Korak za korakom s številkami

Recept za vsako nalogo:

1. Iz vsake premice izpiši točko in smerni vektor, iz vsake ravnine normalo (koeficiente) in desno stran.
2. Primerjaj vektorje: vzporedna sta, če je eden večkratnik drugega (vektorski produkt je $\vec 0$).
3. Za skupno točko: premico vstavi v ravnino (en parameter) ali izenači dve premici (parametra $t$, $s$).
4. Za razdaljo izberi formulo po vrsti objektov; vedno absolutna vrednost in deljenje z dolžino.
5. Za kot izberi $\cos$ (premici, ravnini) ali $\sin$ (premica in ravnina).

Primer: kot med ravninama $x + y = 1$ in $y + z = 2$. Normali $(1, 1, 0)$ in $(0, 1, 1)$, skalarni produkt $1$, dolžini $\sqrt{2}$. $\cos\varphi = \frac{1}{2}$, zato $\varphi = 60^\circ$.

## Drugače: Bolj natančno

Premica je množica $\{\vec r_A + t\,\vec e ;\ t \in \mathbb{R}\}$, torej premaknjen enodimenzionalni podprostor $\mathrm{Lin}\{\vec e\}$. Ravnina je premaknjen dvodimenzionalni podprostor $\mathrm{Lin}\{\vec u, \vec v\}$. Zapis ni enoličen: točko lahko izberemo poljubno, smerni vektor pa lahko pomnožimo s poljubnim $\lambda \ne 0$.

**Izpeljava razdalje točka–ravnina.** Naj bo $A$ v ravnini. Razdalja je dolžina pravokotne projekcije $\overrightarrow{AT}$ na normalo: $\delta = \frac{|\overrightarrow{AT} \cdot \vec n|}{|\vec n|}$. Ker je $\vec n \cdot \vec r_A = d$, je $\overrightarrow{AT} \cdot \vec n = ax_1 + by_1 + cz_1 - d$.

**Hessova normalna oblika.** Če enačbo delimo z $|\vec n|$, dobimo $\vec n_0 \cdot \vec r = p$ z enotsko normalo $\vec n_0$. Pri $p \ge 0$ je $p$ razdalja ravnine od izhodišča, vrednost $\vec n_0 \cdot \vec r_T - p$ pa predznačena razdalja: predznak pove, na kateri strani ravnine leži $T$.

**Povezava s sistemi.** Lega treh ravnin je rešljivost sistema treh linearnih enačb s tremi neznankami. Ena rešitev pomeni eno skupno točko, premica rešitev pomeni pramen ravnin skozi premico, brez rešitve pa vsaj dve vzporedni ravnini ali »prizmo«. Pogoj $\overrightarrow{AB} \cdot (\vec e_1 \times \vec e_2) = 0$ je mešani produkt, ki je enak determinanti matrike iz treh vektorjev. To bo pojasnila tema o determinantah.

## Preveri se

? Kaj pove vektor $(a, b, c)$ v enačbi ravnine $ax + by + cz = d$?
- Smer, v kateri ravnina leži.
~ Vektor $(a, b, c)$ ne leži v ravnini, ampak je nanjo pravokoten. Smerna vektorja ravnine sta pravokotna nanj.
+ Normalo, vektor, pravokoten na ravnino.
- Točko, skozi katero gre ravnina.
~ Točka $(a, b, c)$ v splošnem ne ustreza enačbi. Točko dobiš z izbiro koordinat, ki ustrezajo enačbi.
> Iz $\vec n \cdot (\vec r - \vec r_A) = 0$ sledi, da so koeficienti pri $x$, $y$, $z$ komponente normale.

? Smerna vektorja dveh premic v prostoru nista vzporedna. Kaj lahko zagotovo trdimo?
- Premici se sekata.
~ To velja v ravnini. V prostoru sta lahko mimobežni, zato preveriš še skupno točko.
+ Premici se sekata ali pa sta mimobežni.
- Premici sta pravokotni.
~ Nevzporedni ne pomeni pravokotni. Pravokotnost zahteva $\vec e_1 \cdot \vec e_2 = 0$.
> Nevzporedni premici se sekata natanko tedaj, ko je $\overrightarrow{AB} \cdot (\vec e_1 \times \vec e_2) = 0$; sicer sta mimobežni.

? Za premico s smernim vektorjem $\vec e$ in ravnino z normalo $\vec n$ velja $\vec e \cdot \vec n = 0$. Kaj to pomeni?
- Premica je pravokotna na ravnino.
~ $\vec e \perp \vec n$ pomeni, da je premica pravokotna na normalo, torej poteka vzdolž ravnine. Pravokotna na ravnino bi bila, če $\vec e \parallel \vec n$.
+ Premica je vzporedna z ravnino ali leži v njej.
- Premica seka ravnino v eni točki.
~ Pri vstavljanju v enačbo ravnine koeficient pri $t$ izgine, zato enolične rešitve za $t$ ni.
> Ker je $\vec e$ pravokoten na normalo, premica teče vzdolž ravnine. Leži v njej, če točka $A$ ustreza enačbi ravnine.

? Kolikšna je razdalja točke $T(1, 2, 3)$ od ravnine $2x + y - 2z = 1$?
- $-3$
~ To je vrednost $2 + 2 - 6 - 1$. Razdalja ni negativna in ni deljena z dolžino normale.
- $3$
~ Absolutno vrednost si upošteval, deljenje z $|\vec n| = 3$ pa ne.
+ $1$
- $\frac{1}{3}$
~ Deliti moraš z $|\vec n| = \sqrt{4 + 1 + 4} = 3$, ne z njenim kvadratom $|\vec n|^2 = 9$.
> $\delta = \dfrac{|2 + 2 - 6 - 1|}{\sqrt{4 + 1 + 4}} = \dfrac{3}{3} = 1$.

? Kolikšen je kot med ravninama $x + y = 1$ in $y + z = 2$?
- $0^\circ$
~ Skalarni produkt normal je $1$, a ga moraš deliti s produktom dolžin $\sqrt{2} \cdot \sqrt{2} = 2$. Tako dobiš $\cos\varphi = \frac{1}{2}$, ne $1$.
- $30^\circ$
~ To bi dal sinus, ki ga uporabimo za kot med premico in ravnino. Med ravninama računamo s kosinusom normal.
+ $60^\circ$
> Normali $(1, 1, 0)$ in $(0, 1, 1)$: $\cos\varphi = \dfrac{1}{\sqrt{2}\,\sqrt{2}} = \dfrac{1}{2}$, torej $\varphi = 60^\circ$.

:::simboli
\vec r | krajevni vektor točke premice (ravnine) | \vec r = \vec r_A + t\,\vec e
\vec r_A | krajevni vektor dane točke A | | | pri drugi premici r_B (točka B)
t | parameter | | | t ∈ ℝ; pri ravnini še s
\vec e | smerni vektor premice | | | e ≠ 0
\vec e_1, \vec e_2 | smerna vektorja dveh premic
e_1, e_2, e_3 | komponente smernega vektorja e
x, y, z | koordinate točke
x_0, y_0, z_0 | koordinate točke A
x_1, y_1, z_1 | koordinate točke T
a, b, c | komponente normale (koeficienti enačbe ravnine)
d | prosti člen enačbe ravnine | d = \vec n \cdot \vec r_A
\vec n | normala ravnine | \vec n = (a, b, c) | | pravokotna na ravnino
\delta | razdalja (točke od ravnine, premice; med premicama) | \delta = \frac{\lvert a x_1 + b y_1 + c z_1 - d \rvert}{\sqrt{a^2 + b^2 + c^2}} | | zveza velja za razdaljo točke T od ravnine
\varphi | kot med premicama, med ravninama ali med premico in ravnino | \cos\varphi = \frac{\lvert \vec e_1 \cdot \vec e_2 \rvert}{\lvert \vec e_1 \rvert\,\lvert \vec e_2 \rvert} | | 0° ≤ φ ≤ 90°; pri premici in ravnini sin φ
\Sigma, \Sigma_1, \Sigma_2 | ravnina (ime ravnine) | | | Σ₁, Σ₂ vzporedni ravnini
A | dana točka premice (ravnine)
B | točka druge premice | | | pri ravnini skozi tri točke druga točka
C | tretja točka ravnine
T | poljubna točka (premice, ravnine ali zunaj nje)
:::
