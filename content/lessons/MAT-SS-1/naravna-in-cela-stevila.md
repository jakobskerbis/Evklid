---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka iz narave. V gozdovih Severne Amerike živijo škržati, ki skoraj vse življenje preživijo pod zemljo. Ena vrsta pride na površje natanko vsakih $13$ let, druga vsakih $17$ let. Leta $2024$ sta se obe vrsti pojavili hkrati. Katerega leta se bosta spet? Poskusi, preden bereš naprej.

Če si štel po $13$ in po $17$, si iskal skupni večkratnik. Rešitev in razlog, zakaj škržatom koristijo praštevila, sta v razlagi.

Deljivost, praštevila, največji skupni delitelj $D$ in najmanjši skupni večkratnik $v$ poznaš iz osnovne šole, iz prejšnje teme pa jezik množic. Zdaj to znanje zgradimo natančneje, z deljenjem z ostankom in Evklidovim algoritmom, ki $D$ hitro najde tudi pri velikih številih. Deljivost potrebuješ pri krajšanju ulomkov, pri ponavljajočih se dogodkih in pri spletnem plačevanju: šifriranje temelji na tem, da je produkt dveh velikih praštevil zelo težko razcepiti.

## Razlaga

**1. Naravna števila.** Množico naravnih števil pišemo $\mathbb{N} = \{1, 2, 3, \dots\}$, z ničlo pa $\mathbb{N}_0 = \{0, 1, 2, 3, \dots\}$. Vsota in produkt dveh naravnih števil sta spet naravni števili, razlika pa ne vedno: $3 - 5$ ni naravno število.

*Preveri:* Ali je $0$ naravno število? (Ne, $0 \in \mathbb{N}_0$, $0 \notin \mathbb{N}$.)

**2. Cela števila.** Množica celih števil je $\mathbb{Z} = \{\dots, -3, -2, -1, 0, 1, 2, 3, \dots\}$ in velja $\mathbb{N} \subset \mathbb{N}_0 \subset \mathbb{Z}$. Vsako celo število $a$ ima nasprotno število $-a$, za katero je $a + (-a) = 0$. **Absolutna vrednost** $|a|$ je razdalja števila $a$ od $0$ na številski premici, na primer $|-5| = 5$. V $\mathbb{Z}$ lahko vedno seštevamo, odštevamo in množimo, deliti pa ne vedno ($7 : 2$ ni celo število). Odštevanje je prištevanje nasprotnega števila: $a - (-b) = a + b$. Produkt dveh števil z enakim predznakom je pozitiven, z različnima predznakoma pa negativen.

*Preveri:* Koliko je $|-7| + (-7)$? ($7 + (-7) = 0$.)

**3. Deljivost.** Celo število $a \neq 0$ **deli** celo število $b$, zapisano $a \mid b$, če obstaja tako celo število $k$, da je $b = k \cdot a$. Pravimo tudi, da je $a$ *delitelj* števila $b$ in da je $b$ *večkratnik* števila $a$. Na primer $4 \mid 28$, ker je $28 = 7 \cdot 4$, in $-3 \mid 12$, ker je $12 = (-4) \cdot (-3)$, medtem ko $7 \nmid 30$. Veljajo naslednje lastnosti:

- $1 \mid b$ za vsak $b$, ter $a \mid a$ in $a \mid 0$ za vsak $a \neq 0$,
- če $a \mid b$ in $a \mid c$, potem $a \mid (b + c)$ in $a \mid (b - c)$ (iz $b = ka$ in $c = la$ sledi $b \pm c = (k \pm l)a$),
- če $a \mid b$ in $b \mid c$, potem $a \mid c$.

*Preveri:* Ali $-6 \mid 18$? (Da, $18 = (-3) \cdot (-6)$.)

**4. Merila za deljivost.**

| Delitelj | Merilo | Primer |
|---|---|---|
| $2$ | zadnja števka je $0, 2, 4, 6$ ali $8$ | $1\,358$ |
| $3$ | vsota števk je deljiva s $3$ | $4\,521$ ($4+5+2+1=12$) |
| $4$ | zadnji dve števki tvorita število, deljivo s $4$ | $7\,316$ ($16 = 4 \cdot 4$) |
| $5$ | zadnja števka je $0$ ali $5$ | $2\,045$ |
| $6$ | deljivo z $2$ in s $3$ | $1\,332$ |
| $8$ | zadnje tri števke tvorijo število, deljivo z $8$ | $5\,120$ ($120 = 8 \cdot 15$) |
| $9$ | vsota števk je deljiva z $9$ | $6\,354$ ($6+3+5+4=18$) |
| $10$ | zadnja števka je $0$ | $830$ |

:::premisli
Zakaj je za deljivost s $4$ dovolj pogledati zadnji dve števki?
---
Število razstavimo na stotice in ostanek: $7\,316 = 73 \cdot 100 + 16$. Ker je $100 = 25 \cdot 4$, je del s stoticami vedno deljiv s $4$. Deljivost je zato odvisna le od zadnjih dveh števk. Pri $8$ je razlog $1\,000 = 125 \cdot 8$.
:::

Če sta števili $m$ in $n$ tuji (nimata skupnega pozitivnega delitelja razen $1$) in obe delita $b$, potem tudi njun produkt $m \cdot n$ deli $b$. Zato je število deljivo s $6$, če je deljivo z $2$ in s $3$, ter s $36$, če je deljivo s $4$ in z $9$. Za števili, ki nista tuji, to ne velja: $2$ in $4$ delita $12$, število $8$ pa ne.

**5. Deljenje z ostankom.** Za celo število $a$ in naravno število $b$ obstajata natanko določeni celi števili $q$ (količnik) in $r$ (ostanek), da velja

$$a = q \cdot b + r, \qquad 0 \le r < b.$$

Na primer $47 = 9 \cdot 5 + 2$ in $-17 = (-4) \cdot 5 + 3$. Število $b$ deli $a$ natanko tedaj, ko je ostanek $r = 0$.

*Preveri:* Kolikšen je ostanek pri deljenju $-9$ s $4$? ($-9 = (-3) \cdot 4 + 3$, ostanek je $3$.)

**6. Praštevila in razcep.** Naravno število $p > 1$ je **praštevilo**, če ima natanko dva pozitivna delitelja, $1$ in $p$. Naravno število, večje od $1$, ki ni praštevilo, je **sestavljeno**. Število $1$ ni ne praštevilo ne sestavljeno število. Število $2$ je edino sodo praštevilo. Praštevila do $50$ so: $2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47$.

Ali je $n$ praštevilo, preveriš tako, da poskusiš deliti s praštevili $p$, za katera je $p^2 \le n$. Če je namreč $n = a \cdot b$ z $1 < a \le b$, je $a^2 \le a \cdot b = n$. Sestavljeno število ima torej delitelj $a$ z $a^2 \le n$, in tak delitelj je tudi vsak prafaktor števila $a$.

**Osnovni izrek aritmetike:** vsako naravno število $n > 1$ je produkt praštevil, in to na en sam način (do vrstnega reda faktorjev). Na primer $360 = 2 \cdot 2 \cdot 2 \cdot 3 \cdot 3 \cdot 5 = 2^3 \cdot 3^2 \cdot 5$. Praštevil je neskončno mnogo.

*Preveri:* Ali je $97$ praštevilo? (Da: ne delijo ga $2$, $3$, $5$ in $7$, naslednje praštevilo pa ima $11^2 = 121 > 97$.)

**7. Največji skupni delitelj in najmanjši skupni večkratnik.** Največji skupni delitelj $D(a, b)$ je največje naravno število, ki deli $a$ in $b$. Najmanjši skupni večkratnik $v(a, b)$ je najmanjše naravno število, ki ga delita $a$ in $b$. V jeziku množic: $D(a, b)$ je največji element preseka množic deliteljev, $v(a, b)$ pa najmanjši element preseka množic naravnih večkratnikov. Če je $D(a, b) = 1$, sta števili **tuji**.

Iz razcepa na prafaktorje dobiš:

- $D(a, b)$ je produkt prafaktorjev, ki nastopajo v *obeh* številih, vsakega z *manjšim* eksponentom,
- $v(a, b)$ je produkt *vseh* prafaktorjev, ki nastopajo v vsaj enem številu, vsakega z *večjim* eksponentom,
- za naravni števili $a$ in $b$ velja $D(a, b) \cdot v(a, b) = a \cdot b$.

Zdaj znaš rešiti uganko s škržati. Števili $13$ in $17$ sta različni praštevili, zato sta tuji in $v(13, 17) = 13 \cdot 17 = 221$. Obe vrsti se spet pojavita hkrati leta $2024 + 221 = 2245$.

:::premisli
Denimo, da se plenilec škržatov množično pojavi vsaka $4$ leta. Napovej: kako pogosto bi naletel na škržate s ciklom $16$ let in kako pogosto na tiste s ciklom $17$ let?
---
Ujemanje se ponovi po $v$ obeh ciklov. Ker $4 \mid 16$, je $v(4, 16) = 16$: plenilec bi bil tam ob vsakem pojavu škržatov. Ker sta $4$ in $17$ tuji, je $v(4, 17) = 68$: plenilec bi ujel šele vsak četrti pojav. Praštevilski cikel se torej redko ujame s krajšimi cikli. To je ena od razlag biologov, ni pa dokončno potrjena.
:::

**8. Evklidov algoritem (višja raven).** Če je $a = q \cdot b + r$, je $D(a, b) = D(b, r)$: vsak skupni delitelj števil $a$ in $b$ deli tudi $r = a - q \cdot b$ (dokaz je v razdelku »Bolj natančno«). Deljenje z ostankom zato ponavljamo, dokler ne dobimo ostanka $0$. Zadnji ostanek, ki ni $0$, je $D(a, b)$. Na primer: $48 = 2 \cdot 18 + 12$, $18 = 1 \cdot 12 + 6$, $12 = 2 \cdot 6 + 0$, zato je $D(48, 18) = 6$.

V simulaciji spodaj (»Evklidov algoritem s kvadrati«) nastavi $a = 48$ in $b = 18$. Iz pravokotnika $48 \times 18$ se odrežeta dva kvadrata s stranico $18$, nato en s stranico $12$ in na koncu dva s stranico $6$. Opazi: stranica zadnjega kvadrata je $D(48, 18) = 6$.

*Preveri:* Koliko je $D(35, 21)$? ($35 = 1 \cdot 21 + 14$, $21 = 1 \cdot 14 + 7$, $14 = 2 \cdot 7 + 0$, torej $7$.)

## Rešeni primeri

### Primer 1 (lažji)

Z merili za deljivost ugotovi, s katerimi od števil $2$, $3$, $4$, $5$ in $9$ je deljivo število $4\,536$.

**Podatki:** število $4\,536$; preverjamo delitelje $2$, $3$, $4$, $5$ in $9$
**Iščemo:** katera od števil $2$, $3$, $4$, $5$, $9$ delijo število $4\,536$

:::formula
Merila: z $2$ (zadnja števka soda), s $5$ (zadnja števka $0$ ali $5$), s $3$ ali z $9$ (vsota števk deljiva s $3$ oziroma z $9$), s $4$ (zadnji dve števki tvorita število, deljivo s $4$).
:::

**Rešitev:**

1. Zadnja števka je $6$. Je soda, zato je število deljivo z $2$. Ni $0$ ali $5$, zato ni deljivo s $5$.
2. Vsota števk je $4 + 5 + 3 + 6 = 18$. Število $18$ je deljivo s $3$ in z $9$, zato je tudi $4\,536$ deljivo s $3$ in z $9$.
3. Zadnji dve števki tvorita število $36 = 4 \cdot 9$, zato je $4\,536$ deljivo s $4$.
4. Odgovor: število $4\,536$ je deljivo z $2$, $3$, $4$ in $9$, s $5$ pa ni deljivo. Ker sta $4$ in $9$ tuji števili, je deljivo tudi s $36$: $4\,536 = 36 \cdot 126$.

### Primer 2 (srednji)

Določi $D(252, 420)$ in $v(252, 420)$ s pomočjo razcepa na prafaktorje. Rezultat preveri z zvezo $D(a, b) \cdot v(a, b) = a \cdot b$.

**Podatki:** $a = 252$, $b = 420$
**Iščemo:** $D(252, 420)$ in $v(252, 420)$

:::formula
$D$: skupni prafaktorji z manjšim eksponentom. $v$: vsi prafaktorji z večjim eksponentom. Preizkus: $D(a, b) \cdot v(a, b) = a \cdot b$.
:::

**Rešitev:**

1. Razcep prvega števila: $252 = 2 \cdot 126 = 2 \cdot 2 \cdot 63 = 2 \cdot 2 \cdot 3 \cdot 3 \cdot 7 = 2^2 \cdot 3^2 \cdot 7$.
2. Razcep drugega števila: $420 = 2 \cdot 210 = 2 \cdot 2 \cdot 105 = 2 \cdot 2 \cdot 3 \cdot 5 \cdot 7 = 2^2 \cdot 3 \cdot 5 \cdot 7$.
3. Največji skupni delitelj: skupni prafaktorji so $2$, $3$ in $7$. Manjši eksponent je pri $2$ enak $2$, pri $3$ enak $1$ in pri $7$ enak $1$. Torej $D = 2^2 \cdot 3 \cdot 7 = 4 \cdot 3 \cdot 7 = 84$.
4. Najmanjši skupni večkratnik: vzamemo vse prafaktorje z večjim eksponentom, to so $2^2$, $3^2$, $5$ in $7$. Torej $v = 4 \cdot 9 \cdot 5 \cdot 7 = 1\,260$.
5. Preizkus: $D \cdot v = 84 \cdot 1\,260 = 105\,840$ in $a \cdot b = 252 \cdot 420 = 105\,840$. Produkta sta enaka.
6. Odgovor: $D(252, 420) = 84$ in $v(252, 420) = 1\,260$.

### Primer 3 (težji)

Gozdarji bodo na poseko posadili sadike smreke. Če jih razporedijo v vrste po $4$, po $5$ ali po $6$, jim vsakič ostanejo $3$ sadike. Sadik je vsaj $100$. Koliko sadik imajo najmanj?

**Podatki:** vrste po $4$, $5$ ali $6$ sadik; vsakič ostanejo $3$ sadike; število sadik $n \ge 100$
**Iščemo:** najmanjše tako število sadik $n$

:::formula
Če je $n = q \cdot d + 3$, je $d \mid (n - 3)$. Število $n - 3$ je zato večkratnik števila $v(4, 5, 6)$.
:::

**Rešitev:**

1. Pri deljenju s $4$, $5$ in $6$ je ostanek $3$, zato je $n = q_1 \cdot 4 + 3 = q_2 \cdot 5 + 3 = q_3 \cdot 6 + 3$. Torej števila $4$, $5$ in $6$ delijo $n - 3$.
2. Najmanjši skupni večkratnik: $4 = 2^2$, $5$ in $6 = 2 \cdot 3$. Vzamemo vse prafaktorje z največjimi eksponenti: $v(4, 5, 6) = 2^2 \cdot 3 \cdot 5 = 60$.
3. Vsak skupni večkratnik je večkratnik števila $60$, zato je $n - 3 = 60k$ in $n = 60k + 3$.
4. Sadik je vsaj $100$, torej $60k + 3 \ge 100$ in $60k \ge 97$, zato je $k \ge 2$. Pri $k = 1$ bi bilo sadik $63$, kar je premalo, pri $k = 2$ pa $n = 123$.
5. Preverimo: $123 = 30 \cdot 4 + 3$, $123 = 24 \cdot 5 + 3$, $123 = 20 \cdot 6 + 3$.
6. Odgovor: gozdarji imajo najmanj $123$ sadik.

### Primer 4 (višja raven) – zdaj ti

Z Evklidovim algoritmom določi $D(1071, 462)$, nato še $v(1071, 462)$.

**Podatki:** $a = 1\,071$, $b = 462$
**Iščemo:** $D(1071, 462)$ in $v(1071, 462)$

:::formula
$D(a, b) = D(b, r)$, kjer je $a = q \cdot b + r$; nato $v = \dfrac{a \cdot b}{D}$
:::

**Rešitev:**

1. $1\,071 = 2 \cdot 462 + 147$, ker je $2 \cdot 462 = 924$ in $1\,071 - 924 = 147$. Nadaljujemo s $462$ in $147$.
2. $462 = 3 \cdot 147 + 21$, ker je $3 \cdot 147 = 441$. Nadaljujemo s $147$ in $21$.
3. Naredi zadnji korak sam, preberi $D$ in izračunaj še $v$.

:::premisli
Kolikšna sta $D(1071, 462)$ in $v(1071, 462)$?
---
$147 = 7 \cdot 21 + 0$, zato je $D(1071, 462) = 21$. Res je $1\,071 = 21 \cdot 51$ in $462 = 21 \cdot 22$. Ker je $1\,071 : 21 = 51$, je $v = \dfrac{1\,071 \cdot 462}{21} = 51 \cdot 462 = 23\,562$.
:::

## Pogoste napake

- **»Število 1 je praštevilo« in »vsa liha števila so praštevila«.** Razlog: praštevilo mora imeti natanko dva pozitivna delitelja, število $1$ ima en sam delitelj, število $9$ pa tri ($1$, $3$ in $9$). Pravilno: preštej delitelje. Liha števila $9$, $15$ in $21$ so sestavljena.
- **Napačno sestavljeno merilo.** Sklepaš: »$12$ je deljivo z $2$ in s $4$, torej tudi z $8$.« Razlog: produkt lahko uporabiš le pri tujih deliteljih, števili $2$ in $4$ pa nista tuji. Pravilno: za $8$ uporabi merilo o zadnjih treh števkah; $12 : 8$ ni celo število.
- **Zamenjana eksponenta pri $D$ in $v$.** Pri $D$ vzameš večji eksponent ali pa pri $v$ izpustiš prafaktor, ki je le v enem številu. Razlog: $D$ ne sme biti večji od nobenega od števil, $v$ pa ne manjši od nobenega. Pravilno: $D$ iz skupnih prafaktorjev z *manjšim* eksponentom, $v$ iz *vseh* prafaktorjev z *večjim* eksponentom. Na koncu preveri $D \cdot v = a \cdot b$.
- **Napačen predznak pri odštevanju negativnega števila.** Izračunaš $-3 - (-5) = -8$. Razlog: odštevanje negativnega števila je prištevanje nasprotnega števila. Pravilno: $-3 - (-5) = -3 + 5 = 2$.
- **Negativen ostanek ali ostanek, večji od delitelja.** Zapišeš $47 = 8 \cdot 5 + 7$ ali $-17 = (-3) \cdot 5 - 2$. Razlog: ostanek mora ležati v območju $0 \le r < b$. Pravilno: $47 = 9 \cdot 5 + 2$ in $-17 = (-4) \cdot 5 + 3$.

## Povzetek

- $\mathbb{N} = \{1, 2, 3, \dots\}$, $\mathbb{N}_0 = \mathbb{N} \cup \{0\}$, $\mathbb{Z} = \{\dots, -2, -1, 0, 1, 2, \dots\}$ in $\mathbb{N} \subset \mathbb{N}_0 \subset \mathbb{Z}$.
- $a \mid b$ pomeni, da obstaja celo število $k$ z $b = k \cdot a$. Če $a \mid b$ in $a \mid c$, potem $a \mid (b \pm c)$.
- Merila: $2$ (zadnja števka), $3$ in $9$ (vsota števk), $4$ (zadnji dve števki), $5$ (zadnja števka), $8$ (zadnje tri števke). Sestavljeno merilo (npr. za $6$) velja le za tuja delitelja.
- Deljenje z ostankom: $a = q \cdot b + r$ z $0 \le r < b$.
- Praštevilo ima natanko dva pozitivna delitelja; $1$ ni praštevilo. Vsako število $n > 1$ je na en sam način produkt praštevil.
- $D(a, b)$: skupni prafaktorji z manjšim eksponentom. $v(a, b)$: vsi prafaktorji z večjim eksponentom. Velja $D(a, b) \cdot v(a, b) = a \cdot b$.
- Evklidov algoritem: $D(a, b) = D(b, r)$, ponavljamo do ostanka $0$.

## Drugače: Na sliki

Na številski premici so naravna števila desno od ničle, nasprotna števila pa levo, na enaki razdalji od ničle. Ta razdalja je $|a|$.

Zdaj še Vennov diagram za delitelje števil $12$ in $18$. Samo v levem krogu (delitelji števila $12$) sta $4$ in $12$. Samo v desnem krogu (delitelji števila $18$) sta $9$ in $18$. V prekrivanju so skupni delitelji $1, 2, 3, 6$. Največji element prekrivanja je $D(12, 18) = 6$. Podobno velja pri večkratnikih: večkratniki števila $12$ so $12, 24, 36, 48, \dots$, večkratniki števila $18$ pa $18, 36, 54, 72, \dots$ Prvi skupni večkratnik je $36$, torej $v(12, 18) = 36$.

## Drugače: Bolj natančno

**Zakaj Evklidov algoritem deluje (višja raven).** Naj bo $a = q \cdot b + r$. Vsak skupni delitelj števil $a$ in $b$ deli tudi $r = a - q \cdot b$. Vsak skupni delitelj števil $b$ in $r$ deli tudi $a = q \cdot b + r$. Števili $a$, $b$ in števili $b$, $r$ imata torej iste skupne delitelje, zato tudi isti največji skupni delitelj. Ostanki padajo, zato po končno mnogo korakih pridemo do $0$.

**Praštevil je neskončno mnogo.** Denimo, da jih je končno mnogo: $p_1, p_2, \dots, p_n$. Poglej število $N = p_1 \cdot p_2 \cdots p_n + 1$. Pri deljenju z vsakim $p_i$ da ostanek $1$, torej ga nobeno od njih ne deli. Toda $N > 1$ ima nek prafaktor, ki je praštevilo, a ni nobeno od $p_1, \dots, p_n$. To je protislovje.

**Merilo za $9$.** Ker je $1\,000 = 999 + 1$, $100 = 99 + 1$ in $10 = 9 + 1$, je $4\,536 = (4 \cdot 999 + 5 \cdot 99 + 3 \cdot 9) + (4 + 5 + 3 + 6)$. Prvi oklepaj je deljiv z $9$, zato odloča le vsota števk. Enako velja za $3$.

**Zakaj $D \cdot v = a \cdot b$ (višja raven).** Če ima praštevilo v $a$ in $b$ eksponenta $\alpha$ in $\beta$, ima v $D$ manjšega, v $v$ pa večjega od njiju. Skupaj dasta $\alpha + \beta$, kot v produktu $a \cdot b$.

## Preveri se

? Katera trditev je pravilna?
- Število $1$ je praštevilo, ker ga deli samo $1$.
~ Praštevilo ima natanko dva pozitivna delitelja. Število $1$ ima enega samega.
- Število $91$ je praštevilo, ker je liho in ni deljivo s $3$.
~ Liho število je lahko sestavljeno: $91 = 7 \cdot 13$. Preizkusi vsa praštevila $p$ s $p^2 \le 91$.
- Vsako število, deljivo z $2$ in s $4$, je deljivo tudi z $8$.
~ Produkt deliteljev smeš vzeti le pri tujih številih. Število $12$ je deljivo z $2$ in s $4$, z $8$ pa ne.
+ Število $59$ je praštevilo.
> Praštevila $p$ s $p^2 \le 59$ so $2$, $3$, $5$ in $7$. Nobeno ne deli $59$, zato je $59$ praštevilo.

? Koliko je $D(48, 36)$?
- $6$
~ $6$ je skupni delitelj, a ne največji: tudi $12$ deli obe števili.
+ $12$
- $144$
~ To je $v(48, 36) = 2^4 \cdot 3^2$: vzel si večja eksponenta. Pri $D$ vzameš manjša.
> $48 = 2^4 \cdot 3$ in $36 = 2^2 \cdot 3^2$. Skupna prafaktorja z manjšima eksponentoma dasta $D = 2^2 \cdot 3 = 12$.

? Nika je računala $v(12, 18)$: »$12 = 2^2 \cdot 3$, $18 = 2 \cdot 3^2$, zato je $v = 2 \cdot 3 = 6$.« Kje je napaka?
- Razcepa sta napačna.
~ Razcepa sta pravilna: $2^2 \cdot 3 = 12$ in $2 \cdot 3^2 = 18$.
+ Vzela je manjša eksponenta, kar je pravilo za $D$. Pravilno je $v = 2^2 \cdot 3^2 = 36$.
- Napake ni.
~ Število $6$ je manjše od $12$, zato ne more biti večkratnik števila $12$. Nika je izračunala $D(12, 18)$.
> Pri $v$ vzamemo vse prafaktorje z večjim eksponentom: $v = 4 \cdot 9 = 36$. Preizkus: $6 \cdot 36 = 216 = 12 \cdot 18$.

? Primerjaj ostanka pri deljenju s $5$: števila $17$ in števila $-17$. Kaj velja?
- Ostanka sta enaka, oba sta $2$.
~ Predznak spremeni ostanek. Iz $-17 = (-3) \cdot 5 - 2$ ne smeš vzeti $2$, saj tu $2$ odštevamo.
- Ostanek pri $-17$ je $-2$, torej je manjši.
~ Ostanek mora ležati v območju $0 \le r < 5$, zato $-2$ ni ostanek.
+ Ostanek pri $-17$ je $3$, pri $17$ pa $2$, torej je prvi večji.
> $17 = 3 \cdot 5 + 2$ in $-17 = (-4) \cdot 5 + 3$. Ostanka sta $2$ in $3$.

? Vremenska postaja pošlje podatek o temperaturi vsakih $15$ minut, podatek o vetru pa vsakih $20$ minut. Ob 12.00 pošlje oba hkrati. Kdaj ju naslednjič pošlje hkrati?
- Ob 12.05.
~ $5$ minut je $D(15, 20)$. Pri čakanju na ponovno ujemanje iščemo skupni večkratnik, ne delitelja.
- Ob 12.35.
~ $15 + 20 = 35$ ni večkratnik števila $15$, zato ob 12.35 temperatura ni na vrsti.
- Ob 17.00.
~ $15 \cdot 20 = 300$ minut je skupni večkratnik, a ne najmanjši, ker $15$ in $20$ nista tuji.
+ Ob 13.00.
> $15 = 3 \cdot 5$ in $20 = 2^2 \cdot 5$, zato je $v(15, 20) = 2^2 \cdot 3 \cdot 5 = 60$ minut, torej ena ura.

:::simboli
a | celo število; pri $a \mid b$ delitelj, pri deljenju z ostankom deljenec | a = q \cdot b + r | |
b | celo število; pri $a \mid b$ večkratnik, pri deljenju z ostankom delitelj (naravno število) | | |
q | količnik | | |
r | ostanek | | | $0 \le r < b$
D | največji skupni delitelj | | | $D \cdot v = a \cdot b$
v | najmanjši skupni večkratnik | v = \dfrac{a \cdot b}{D} | |
n | naravno število; v Primeru 3 število sadik | n = q \cdot d + 3 | | v Primeru 3 ostanek $3$ pri deljenju s $4$, $5$ in $6$
d | delitelj ($4$, $5$ ali $6$) | | |
:::
