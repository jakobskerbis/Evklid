---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pri utrjevanju epoksidne smole snov A prehaja v vmesni produkt B, ta pa v zamrežen produkt C. V laboratoriju izmerijo, kdaj je B največ: po okoli $9{,}2$ minutah. Kateri korak je hitrejši, prvi ali drugi? Presenetljivo: iz tega časa se tega ne da ugotoviti. Če konstanti hitrosti $k_1 = 0{,}20\,\mathrm{min^{-1}}$ in $k_2 = 0{,}050\,\mathrm{min^{-1}}$ zamenjamo, je vrh B ob natanko istem času, le štirikrat nižji.

Zakaj, pokaže sistem linearnih diferencialnih enačb. Koncentracije treh snovi se spreminjajo hkrati in vplivajo druga na drugo, a ko sistem zapišemo z matriko, ga lastne vrednosti razstavijo na neodvisne eksponentne »načine«. Iz lekcij o enačbah prvega in drugega reda poznaš $y' = ky$ in karakteristično enačbo; iz lekcije o lastnih vrednostih znaš rešiti $A\vec{v} = \lambda\vec{v}$. Tu oboje združimo.

## Razlaga

**1. Slika najprej.** Nariši tri krivulje koncentracij za A → B → C z zgornjima konstantama in $a(0) = 1\,\mathrm{mol/L}$:

| $t$ [min] | $a$ | $b$ |
|---|---|---|
| $0$ | $1{,}00$ | $0{,}00$ |
| $5$ | $0{,}37$ | $0{,}55$ |
| $9{,}2$ | $0{,}16$ | $0{,}63$ |
| $20$ | $0{,}02$ | $0{,}47$ |

Krivulja $a$ pada eksponentno. Krivulja $b$ raste, doseže vrh in počasi pada; $c = 1 - a - b$ raste v obliki črke S do $1$. Krivulja $b$ je razlika dveh eksponentnih funkcij: hitre $e^{-0{,}20t}$ in počasne $e^{-0{,}05t}$. Ta dva »časovna načina« sta lastni vrednosti matrike sistema, $-k_1$ in $-k_2$.

**2. Zapis z matriko.** Zakon o hitrosti za vsako snov:
$$\dot a = -k_1 a, \qquad \dot b = k_1 a - k_2 b, \qquad \dot c = k_2 b.$$
Z $\vec{x} = (a, b, c)^T$ je to $\dot{\vec{x}} = A\vec{x}$ z
$$A = \begin{pmatrix} -k_1 & 0 & 0 \\ k_1 & -k_2 & 0 \\ 0 & k_2 & 0 \end{pmatrix}.$$

**Definicija.** **Sistem linearnih diferencialnih enačb prvega reda s konstantnimi koeficienti** je $\dot{\vec{x}} = A\vec{x} + \vec{f}(t)$, kjer je $A$ realna matrika $n \times n$ in $\vec{x}(t)$ neznana vektorska funkcija. Pri $\vec{f} = \vec{0}$ je sistem **homogen**.

**Izrek (obstoj in enoličnost).** Za vsak začetni vektor $\vec{x}(0) = \vec{x}_0$ ima homogeni sistem natanko eno rešitev, definirano za vse $t \in \mathbb{R}$. Rešitve tvorijo vektorski prostor razsežnosti $n$.

Linearnost je ključna: vsota rešitev in večkratnik rešitve sta spet rešitvi (**načelo superpozicije**). Zadošča torej najti $n$ linearno neodvisnih rešitev.

**3. Nastavek z lastnim vektorjem.** Po zgledu $y' = ky$ poskusimo $\vec{x}(t) = \vec{v}\,e^{\lambda t}$. Vstavimo: $\lambda\vec{v}e^{\lambda t} = A\vec{v}e^{\lambda t}$, torej
$$A\vec{v} = \lambda\vec{v}.$$
Nastavek je rešitev natanko tedaj, ko je $\lambda$ lastna vrednost in $\vec{v}$ pripadajoči lastni vektor.

**Izrek.** Če ima $A$ $n$ linearno neodvisnih lastnih vektorjev $\vec{v}_1, \ldots, \vec{v}_n$ z lastnimi vrednostmi $\lambda_1, \ldots, \lambda_n$, je splošna rešitev
$$\vec{x}(t) = C_1\vec{v}_1e^{\lambda_1t} + \cdots + C_n\vec{v}_ne^{\lambda_nt}.$$

**Dokaz.** Vsak člen je rešitev (zgoraj), vsota rešitev je rešitev. Ob $t = 0$ je $\vec{x}(0) = C_1\vec{v}_1 + \cdots + C_n\vec{v}_n$. Ker so $\vec{v}_i$ baza prostora $\mathbb{R}^n$, lahko vsak $\vec{x}_0$ zapišemo tako z enolično določenimi $C_i$. Po izreku o enoličnosti je to edina rešitev s tem začetnim pogojem, zato zajame vse rešitve. $\square$

Zadosten pogoj: vse lastne vrednosti so različne (lastni vektorji različnih lastnih vrednosti so linearno neodvisni).

*Postopek:* (1) karakteristični polinom $\det(A - \lambda I) = 0$; (2) lastni vektorji; (3) splošna rešitev; (4) konstante iz $\vec{x}(0)$ z rešitvijo linearnega sistema.

:::premisli
Pri A → B → C so lastne vrednosti $-k_1$, $-k_2$ in $0$. Kaj pomeni lastna vrednost $0$ in kateri je pripadajoči lastni vektor? Napovej brez računanja.
---
Lastna vrednost $0$ da rešitev $\vec{v}e^{0 \cdot t}$, ki se ne spreminja: stacionarno stanje. Ko se vse pretvori, je sestava $(0, 0, 1)$: vse je C. Res, $A(0, 0, 1)^T = \vec{0}$, ker je zadnji stolpec matrike ničeln. Lastna vrednost $0$ se pojavi vedno, kadar se celotna množina ohranja (vsota vsakega stolpca matrike je $0$).
:::

**4. Kompleksne lastne vrednosti.** Pri realni $A$ nastopajo v parih $\lambda = \alpha \pm i\beta$. Naj bo $\vec{v} = \vec{p} + i\vec{q}$ lastni vektor za $\alpha + i\beta$. Po Eulerjevi formuli je
$$\vec{v}e^{\lambda t} = e^{\alpha t}(\vec{p} + i\vec{q})(\cos\beta t + i\sin\beta t).$$
Realni in imaginarni del sta realni rešitvi:
$$\vec{x}_1 = e^{\alpha t}(\vec{p}\cos\beta t - \vec{q}\sin\beta t),$$
$$\vec{x}_2 = e^{\alpha t}(\vec{p}\sin\beta t + \vec{q}\cos\beta t).$$
Par $\alpha \pm i\beta$ da torej nihanje s krožno frekvenco $\beta$ in ovojnico $e^{\alpha t}$, kot pri dušenem nihalu.

**5. Večkratna lastna vrednost brez dovolj lastnih vektorjev.** Če ima $\lambda$ algebrsko večkratnost $2$, a le en lastni vektor $\vec{v}$, je druga rešitev
$$\vec{x}_2 = e^{\lambda t}(\vec{v}\,t + \vec{w}), \qquad (A - \lambda I)\vec{w} = \vec{v}.$$
Vektor $\vec{w}$ je **posplošeni lastni vektor**. Faktor $t$ je isti kot pri dvojni ničli karakteristične enačbe drugega reda, $(C_1 + C_2t)e^{\lambda t}$.

**6. Enačba drugega reda kot sistem.** Enačbo $\ddot y + p\dot y + qy = 0$ z novima spremenljivkama $x_1 = y$, $x_2 = \dot y$ zapišemo kot
$$\dot{\vec{x}} = \begin{pmatrix} 0 & 1 \\ -q & -p \end{pmatrix}\vec{x}.$$
Karakteristični polinom te matrike je $\lambda^2 + p\lambda + q$, isti kot pri enačbi drugega reda. Obe metodi sta torej dva pogleda na isto stvar.

**7. Stabilnost.** Rešitev pojema proti $\vec{0}$ za vsak začetni pogoj natanko tedaj, ko imajo vse lastne vrednosti negativen realni del. Lastna vrednost z največjim realnim delom (najpočasnejša) določa, kako hitro se sistem umiri.

:::premisli
V sistemu A → B → C naj bo $k_2 = 100\,k_1$. Napovej, kakšna je krivulja $b(t)$ po kratkem začetnem času in kaj iz tega sledi za merjenje vmesnega produkta.
---
Člen $e^{-k_2t}$ hitro izgine, ostane $b \approx \frac{k_1}{k_2}a$: B je ves čas majhen in sledi A. To je **približek stacionarnega stanja** ($\dot b \approx 0$). Hitro razpadajoč vmesni produkt je težko zaznati, ker ga je le okoli $1\,\%$ toliko kot A.
:::

## Rešeni primeri

### Primer 1: dve realni lastni vrednosti

Reši začetni problem
$$\dot{\vec{x}} = \begin{pmatrix} 1 & 2 \\ 2 & 1 \end{pmatrix}\vec{x}, \qquad \vec{x}(0) = \begin{pmatrix} 3 \\ 1 \end{pmatrix}.$$

**Podatki:** matrika $A$ z elementi $1, 2, 2, 1$; $x_1(0) = 3$, $x_2(0) = 1$
**Iščemo:** $\vec{x}(t)$

:::formula
$\det(A - \lambda I) = 0$; $\quad \vec{x} = C_1\vec{v}_1e^{\lambda_1t} + C_2\vec{v}_2e^{\lambda_2t}$
:::

**Rešitev:**

1. $\det(A - \lambda I) = (1 - \lambda)^2 - 4 = 0$, torej $1 - \lambda = \pm 2$: $\lambda_1 = 3$, $\lambda_2 = -1$.
2. Za $\lambda_1 = 3$: $-2v_1 + 2v_2 = 0$, $\vec{v}_1 = (1, 1)^T$. Za $\lambda_2 = -1$: $2v_1 + 2v_2 = 0$, $\vec{v}_2 = (1, -1)^T$.
3. Začetni pogoj: $C_1 + C_2 = 3$ in $C_1 - C_2 = 1$, torej $C_1 = 2$, $C_2 = 1$.
4. Odgovor: $x_1 = 2e^{3t} + e^{-t}$, $x_2 = 2e^{3t} - e^{-t}$. Preizkus: $\dot x_1 = 6e^{3t} - e^{-t}$ in $x_1 + 2x_2 = 6e^{3t} - e^{-t}$. Ker je $\lambda_1 > 0$, rešitev neomejeno raste vzdolž smeri $(1, 1)$.

### Primer 2: dušeno nihanje nosilca

Navpični odmik konca jeklenega nosilca opisuje $\ddot y + 2\dot y + 5y = 0$ (čas v sekundah, odmik v milimetrih), z $y(0) = 1\,\mathrm{mm}$, $\dot y(0) = 0$. Zapiši enačbo kot sistem in ga reši z lastnimi vektorji.

**Podatki:** $p = 2\,\mathrm{s^{-1}}$, $q = 5\,\mathrm{s^{-2}}$, $y(0) = 1\,\mathrm{mm}$, $\dot y(0) = 0$
**Iščemo:** $y(t)$

:::formula
$A = \begin{pmatrix} 0 & 1 \\ -q & -p \end{pmatrix}$; za $\lambda = \alpha + i\beta$, $\vec{v} = \vec{p} + i\vec{q}$: $\vec{x}_1 = e^{\alpha t}(\vec{p}\cos\beta t - \vec{q}\sin\beta t)$, $\vec{x}_2 = e^{\alpha t}(\vec{p}\sin\beta t + \vec{q}\cos\beta t)$
:::

**Rešitev:**

1. $A = \begin{pmatrix} 0 & 1 \\ -5 & -2 \end{pmatrix}$, karakteristični polinom $\lambda^2 + 2\lambda + 5 = 0$, $\lambda = -1 \pm 2i$.
2. Za $\lambda = -1 + 2i$ prva vrstica $(A - \lambda I)\vec{v} = \vec{0}$ da $(1 - 2i)v_1 + v_2 = 0$; izberemo $v_1 = 1$, $v_2 = -1 + 2i$. Torej $\vec{p} = (1, -1)^T$, $\vec{q} = (0, 2)^T$.
3. Realni rešitvi: $\vec{x}_1 = e^{-t}(\cos 2t,\ -\cos 2t - 2\sin 2t)^T$, $\vec{x}_2 = e^{-t}(\sin 2t,\ -\sin 2t + 2\cos 2t)^T$.
4. Ob $t = 0$: $C_1(1, -1) + C_2(0, 2) = (1, 0)$, torej $C_1 = 1$ in $-1 + 2C_2 = 0$, $C_2 = \frac{1}{2}$.
5. Prva komponenta je $y$: $y(t) = e^{-t}\left(\cos 2t + \tfrac{1}{2}\sin 2t\right)\,\mathrm{mm}$.
6. Odgovor: nosilec niha s krožno frekvenco $2\,\mathrm{s^{-1}}$ (nihajni čas $\pi\,\mathrm{s}$), amplituda pojema kot $e^{-t}$. Enak rezultat da metoda iz lekcije o enačbah drugega reda.

### Primer 3: utrjevanje smole

Pri utrjevanju smole poteka A → B → C s konstantama $k_1 = 0{,}20\,\mathrm{min^{-1}}$ in $k_2 = 0{,}050\,\mathrm{min^{-1}}$, na začetku je $a(0) = 1{,}0\,\mathrm{mol/L}$, $b(0) = c(0) = 0$. Reši sistem z lastnimi vektorji, določi čas in velikost vrha $b$ ter sestavo po $10\,\mathrm{min}$. Pokaži, da zamenjava $k_1 \leftrightarrow k_2$ ne spremeni časa vrha.

**Podatki:** $k_1 = 0{,}20\,\mathrm{min^{-1}}$, $k_2 = 0{,}050\,\mathrm{min^{-1}}$, $a_0 = 1{,}0\,\mathrm{mol/L}$, $b_0 = c_0 = 0$, $t = 10\,\mathrm{min}$
**Iščemo:** $a(t)$, $b(t)$, $c(t)$; $t_{\max}$, $b_{\max}$; sestava ob $10\,\mathrm{min}$

:::formula
$\dot{\vec{x}} = A\vec{x}$ z lastnimi vrednostmi $-k_1$, $-k_2$, $0$; vrh: $\dot b = 0$
:::

**Rešitev:**

1. Matrika je spodnje trikotna, zato so lastne vrednosti na diagonali: $-k_1$, $-k_2$, $0$. Vse so različne, sistem je diagonalizabilen.
2. Lastni vektorji: za $-k_1$ iz $k_1v_1 + (k_1 - k_2)v_2 = 0$ in $k_2v_2 + k_1v_3 = 0$ dobimo $\vec{v}_1 = (k_1 - k_2,\ -k_1,\ k_2)^T$; za $-k_2$: $\vec{v}_2 = (0, 1, -1)^T$; za $0$: $\vec{v}_3 = (0, 0, 1)^T$.
3. Začetni pogoj $(a_0, 0, 0)$: prva komponenta da $C_1 = \frac{a_0}{k_1 - k_2}$; druga $-k_1C_1 + C_2 = 0$, torej $C_2 = \frac{k_1a_0}{k_1 - k_2}$; tretja $k_2C_1 - C_2 + C_3 = 0$, torej $C_3 = a_0$.
4. Rešitev: $a = a_0e^{-k_1t}$, $b = \frac{k_1a_0}{k_1 - k_2}\left(e^{-k_2t} - e^{-k_1t}\right)$, $c = a_0 - a - b$ (vsota se ohranja).
5. Vrh: $\dot b = 0$ da $k_2e^{-k_2t} = k_1e^{-k_1t}$, torej $t_{\max} = \frac{\ln(k_1/k_2)}{k_1 - k_2} = \frac{\ln 4}{0{,}15}\,\mathrm{min} \approx 9{,}24\,\mathrm{min}$.
6. Izraz je simetričen: zamenjava $k_1 \leftrightarrow k_2$ zamenja predznak števca in imenovalca, $t_{\max}$ ostane enak. Spremeni pa se faktor $\frac{k_1}{k_1 - k_2}$ pred oklepajem, zato se vrh zniža za faktor $k_2/k_1 = \frac{1}{4}$.
7. Vrednost vrha: $b_{\max} = \frac{0{,}20}{0{,}15}\left(e^{-0{,}4621} - e^{-1{,}8484}\right)\,\mathrm{mol/L} \approx 0{,}630\,\mathrm{mol/L}$.
8. Ob $10\,\mathrm{min}$: $a = e^{-2} \approx 0{,}135$, $b = \frac{4}{3}(e^{-0{,}5} - e^{-2}) \approx 0{,}628$, $c \approx 1 - 0{,}135 - 0{,}628 = 0{,}237\,\mathrm{mol/L}$.
9. Odgovor: vrh B je ob $9{,}2\,\mathrm{min}$ z $0{,}63\,\mathrm{mol/L}$; ob $10\,\mathrm{min}$ je $a \approx 0{,}135$, $b \approx 0{,}628$ in $c \approx 0{,}237\,\mathrm{mol/L}$. Pri zamenjanih konstantah bi bil vrh ob istem času, a le $0{,}16\,\mathrm{mol/L}$, zato za določitev konstant potrebujemo tudi višino vrha ali krivuljo $a(t)$.

### Primer 4: zdaj ti

Kaj, če sta konstanti enaki, $k_1 = k_2 = k$? Formula iz primera 3 odpove (deljenje z nič). Reši sistem za $a$ in $b$ pri $a(0) = a_0$, $b(0) = 0$.

**Podatki:** $k_1 = k_2 = k$, $a(0) = a_0$, $b(0) = 0$
**Iščemo:** $b(t)$ in $t_{\max}$

:::formula
dvojna lastna vrednost z enim lastnim vektorjem: $\vec{x}_2 = e^{\lambda t}(\vec{v}\,t + \vec{w})$, $(A - \lambda I)\vec{w} = \vec{v}$
:::

**Rešitev:**

1. Za $(a, b)$ je $A = \begin{pmatrix} -k & 0 \\ k & -k \end{pmatrix}$, dvojna lastna vrednost $-k$. $A + kI = \begin{pmatrix} 0 & 0 \\ k & 0 \end{pmatrix}$ ima jedro, razpeto le z $\vec{v} = (0, 1)^T$: en lastni vektor.
2. Posplošeni: $(A + kI)\vec{w} = \vec{v}$ da $kw_1 = 1$, $\vec{w} = (1/k, 0)^T$.
3. Dokončaj sam: zapiši splošno rešitev, določi konstanti iz začetnega pogoja in poišči vrh.

:::premisli
Kolikšna sta $b(t)$ in $t_{\max}$?
---
$\vec{x} = C_1(0, 1)^Te^{-kt} + C_2e^{-kt}\left((0, 1)^Tt + (1/k, 0)^T\right)$. Iz $\vec{x}(0) = (a_0, 0)$: $C_2 = ka_0$, $C_1 = 0$. Torej $a = a_0e^{-kt}$, $b = a_0kt\,e^{-kt}$. Vrh pri $\dot b = a_0k e^{-kt}(1 - kt) = 0$: $t_{\max} = 1/k$, $b_{\max} = a_0/e \approx 0{,}37\,a_0$. To je tudi limita formule iz primera 3, ko $k_2 \to k_1$.
:::

## Pogoste napake

- **Lastne vrednosti brez lastnih vektorjev.** Rešitev ni $C_1e^{\lambda_1t} + C_2e^{\lambda_2t}$ za vsako komponento z istimi konstantami. Vsak način nosi svoj lastni vektor, ki pove, v kakšnem razmerju se komponente spreminjajo.
- **Kompleksna rešitev kot končni odgovor.** Pri realnem problemu vzemi realni in imaginarni del ene kompleksne rešitve; drugo konjugirano lastno vrednost lahko izpustiš, ker da isti rešitvi.
- **Predpostavka, da je vsaka matrika diagonalizabilna.** Pri dvojni lastni vrednosti preveri, koliko je lastnih vektorjev (rang $A - \lambda I$). Če je le en, potrebuješ člen s faktorjem $t$, kot v primeru 4.
- **»Prej je vrh, hitrejši je prvi korak.«** Čas vrha je simetričen v $k_1$ in $k_2$. O tem, kateri korak je hitrejši, povesta višina vrha in potek $a(t)$.
- **Začetni pogoj vstavljen pred superpozicijo.** Konstante določiš šele iz *splošne* rešitve; če jih vstaviš v en sam člen, rešitev ne bo zadoščala vsem komponentam.

## Povzetek

- Sistem $\dot{\vec{x}} = A\vec{x}$: za vsak $\vec{x}(0)$ natanko ena rešitev; rešitve tvorijo prostor razsežnosti $n$.
- Nastavek $\vec{v}e^{\lambda t}$ je rešitev natanko tedaj, ko je $A\vec{v} = \lambda\vec{v}$.
- Diagonalizabilna $A$: $\vec{x} = \sum C_i\vec{v}_ie^{\lambda_it}$; konstante iz $\vec{x}(0)$.
- $\lambda = \alpha \pm i\beta$: realni in imaginarni del $\vec{v}e^{\lambda t}$, nihanje z ovojnico $e^{\alpha t}$.
- Dvojna $\lambda$ z enim lastnim vektorjem: $e^{\lambda t}(\vec{v}t + \vec{w})$, $(A - \lambda I)\vec{w} = \vec{v}$.
- A → B → C: lastne vrednosti $-k_1$, $-k_2$, $0$; $t_{\max} = \ln(k_1/k_2)/(k_1 - k_2)$, simetričen v $k_1$, $k_2$.
- Stabilnost: vsi $\operatorname{Re}\lambda < 0$.

## Za izpit

Znati moraš povedati:

- definicijo sistema s konstantnimi koeficienti in izrek o obstoju in enoličnosti;
- zakaj je $\vec{v}e^{\lambda t}$ rešitev natanko pri $A\vec{v} = \lambda\vec{v}$ in dokaz izreka o splošni rešitvi;
- kako iz kompleksne lastne vrednosti dobiš dve realni rešitvi in zakaj sta rešitvi;
- rešitev z dvojno lastno vrednostjo in posplošenim lastnim vektorjem;
- prevod enačbe drugega reda v sistem in enakost karakterističnih polinomov;
- rešitev A → B → C, $t_{\max}$ in približek stacionarnega stanja.

### Naloga 1

Vmesni produkt B se razgrajuje v dva produkta: A → B ($k_1 = 0{,}30\,\mathrm{h^{-1}}$), B → C ($k_2 = 0{,}10\,\mathrm{h^{-1}}$) in B → D ($k_3 = 0{,}050\,\mathrm{h^{-1}}$). Na začetku je le A z $a_0 = 1{,}0\,\mathrm{mol/L}$. (a) Zapiši matriko sistema za $(a, b, c, d)$ in njene lastne vrednosti. Ali je diagonalizabilna? (b) Določi $b(t)$, čas in velikost vrha B. (c) Kolikšni sta končni koncentraciji C in D? (d) Izračunaj $c$ in $d$ po $10\,\mathrm{h}$.

**Rešitev:**

1. (a) $\dot a = -k_1a$, $\dot b = k_1a - (k_2 + k_3)b$, $\dot c = k_2b$, $\dot d = k_3b$. Matrika je spodnje trikotna z diagonalo $-k_1$, $-(k_2 + k_3)$, $0$, $0$; s $s = k_2 + k_3 = 0{,}15\,\mathrm{h^{-1}}$ so lastne vrednosti $-0{,}30$; $-0{,}15$; $0$; $0$.
2. Lastna vrednost $0$ je dvojna; stolpca za $c$ in $d$ sta ničelna, zato sta $(0, 0, 1, 0)^T$ in $(0, 0, 0, 1)^T$ dva neodvisna lastna vektorja. Skupaj s preostalima dvema so štirje: matrika je diagonalizabilna.
3. (b) Enačbi za $a$ in $b$ sta enaki kot pri A → B → C s $k_2$ zamenjanim s $s$: $b = \frac{k_1a_0}{k_1 - s}\left(e^{-st} - e^{-k_1t}\right) = 2\left(e^{-0{,}15t} - e^{-0{,}30t}\right)\,\mathrm{mol/L}$.
4. $t_{\max} = \frac{\ln(k_1/s)}{k_1 - s} = \frac{\ln 2}{0{,}15}\,\mathrm{h} \approx 4{,}62\,\mathrm{h}$; tam je $e^{-0{,}15t} = \frac{1}{2}$ in $e^{-0{,}30t} = \frac{1}{4}$, zato $b_{\max} = 2\left(\frac{1}{2} - \frac{1}{4}\right) = 0{,}50\,\mathrm{mol/L}$.
5. (c) Ves A se pretvori, iz B pa gre v C delež $k_2/s$ in v D delež $k_3/s$, ker je $\dot c : \dot d = k_2 : k_3$ ob vsakem času. Torej $c_\infty = \frac{2}{3}\,\mathrm{mol/L} \approx 0{,}667$, $d_\infty = \frac{1}{3}\,\mathrm{mol/L} \approx 0{,}333$.
6. (d) Iz istega razmerja: $c = \frac{k_2}{s}(a_0 - a - b)$, $d = \frac{k_3}{s}(a_0 - a - b)$.
7. Ob $10\,\mathrm{h}$: $a = e^{-3} \approx 0{,}0498$, $b = 2(e^{-1{,}5} - e^{-3}) \approx 0{,}347$, torej $a_0 - a - b \approx 0{,}604$.
8. $c \approx \frac{2}{3} \cdot 0{,}6035 \approx 0{,}402\,\mathrm{mol/L}$, $d \approx \frac{1}{3} \cdot 0{,}6035 \approx 0{,}201\,\mathrm{mol/L}$.
9. Odgovor: lastne vrednosti $-0{,}30$; $-0{,}15$; $0$; $0$, matrika je diagonalizabilna; vrh B ob $4{,}6\,\mathrm{h}$ z $0{,}50\,\mathrm{mol/L}$; končno $c = 0{,}67$, $d = 0{,}33\,\mathrm{mol/L}$; po $10\,\mathrm{h}$ $c \approx 0{,}40$ in $d \approx 0{,}20\,\mathrm{mol/L}$.

### Naloga 2

Natančno navedi in dokaži izrek o splošni rešitvi sistema $\dot{\vec{x}} = A\vec{x}$ z diagonalizabilno matriko. Nato za realno matriko $A$ dokaži: če je $\vec{z}(t)$ kompleksna rešitev, sta $\operatorname{Re}\vec{z}$ in $\operatorname{Im}\vec{z}$ realni rešitvi.

**Rešitev:**

1. Izrek: če ima $A$ linearno neodvisne lastne vektorje $\vec{v}_1, \ldots, \vec{v}_n$ za lastne vrednosti $\lambda_i$, je vsaka rešitev oblike $\sum C_i\vec{v}_ie^{\lambda_it}$.
2. $\frac{\mathrm{d}}{\mathrm{d}t}(\vec{v}_ie^{\lambda_it}) = \lambda_i\vec{v}_ie^{\lambda_it} = A\vec{v}_ie^{\lambda_it}$, zato je vsak člen rešitev; po linearnosti tudi vsota.
3. Za dano rešitev $\vec{x}$ zapišemo $\vec{x}(0) = \sum C_i\vec{v}_i$ (baza). Funkcija $\vec{y} = \sum C_i\vec{v}_ie^{\lambda_it}$ je rešitev z istim začetnim pogojem; po enoličnosti je $\vec{x} = \vec{y}$.
4. Kompleksna rešitev: $\vec{z} = \vec{u} + i\vec{w}$ z realnima $\vec{u}$, $\vec{w}$. Iz $\dot{\vec{z}} = A\vec{z}$ sledi $\dot{\vec{u}} + i\dot{\vec{w}} = A\vec{u} + iA\vec{w}$.
5. Ker je $A$ realna, sta $A\vec{u}$ in $A\vec{w}$ realna. Enakost realnih in imaginarnih delov da $\dot{\vec{u}} = A\vec{u}$ in $\dot{\vec{w}} = A\vec{w}$. Za kompleksno matriko sklep ne velja.

### Naloga 3

Reši začetni problem $\dot x_1 = 3x_1 + x_2$, $\dot x_2 = -x_1 + x_2$, $x_1(0) = 1$, $x_2(0) = 2$. Ali rešitev ostane omejena?

**Rešitev:**

1. $\det\begin{pmatrix} 3 - \lambda & 1 \\ -1 & 1 - \lambda \end{pmatrix} = \lambda^2 - 4\lambda + 4 = (\lambda - 2)^2$: dvojna $\lambda = 2$.
2. $A - 2I = \begin{pmatrix} 1 & 1 \\ -1 & -1 \end{pmatrix}$ ima rang $1$: en lastni vektor $\vec{v} = (1, -1)^T$.
3. Posplošeni: $w_1 + w_2 = 1$, izberemo $\vec{w} = (1, 0)^T$.
4. $\vec{x} = C_1\vec{v}e^{2t} + C_2e^{2t}(\vec{v}t + \vec{w})$. Ob $t = 0$: $(C_1 + C_2,\ -C_1) = (1, 2)$, torej $C_1 = -2$, $C_2 = 3$.
5. $x_1 = (1 + 3t)e^{2t}$, $x_2 = (2 - 3t)e^{2t}$.
6. Preizkus: $\dot x_1 = (5 + 6t)e^{2t}$ in $3x_1 + x_2 = (3 + 9t + 2 - 3t)e^{2t} = (5 + 6t)e^{2t}$.
7. Odgovor: $x_1 = (1 + 3t)e^{2t}$, $x_2 = (2 - 3t)e^{2t}$; ker je $\lambda = 2 > 0$, rešitev ni omejena.

## Drugače: Z analogijo

Predstavljaj si kaskado treh posod z vodo, kjer voda iz prve teče v drugo, iz druge v tretjo. Pretok iz posode je sorazmeren z višino vode v njej. Prva posoda se prazni eksponentno. Druga se najprej polni, ker priteka več, kot odteka, nato se prazni; njen vrh je tam, kjer sta dotok in odtok enaka. Tretja se počasi polni do konca.

Lastne vrednosti so »odtočne konstante« posameznih posod, lastni vektorji pa vzorci, po katerih se voda prerazporedi, ko deluje le en odtok. Ožja odtočna cev pri drugi posodi (manjši $k_2$) pomeni, da se v njej nabere več vode.

## Drugače: Uporaba v stroki

- **Radioaktivne verige.** Batemanove enačbe za $^{238}\mathrm{U} \to \ldots \to {}^{206}\mathrm{Pb}$ so spodnje trikotni sistem. Ko je prvi člen zelo dolgoživ, se vzpostavi sekularno ravnotežje (aktivnosti vseh hčerinskih jeder so enake), kar uporabljajo pri datiranju kamnin in pri gama spektrometriji gradbenih materialov.
- **Farmakokinetika.** Dvoprostorni model (kri in tkiva) je sistem dveh enačb; koncentracija v krvi je vsota dveh eksponentnih funkcij. Iz naklonov obeh delov na logaritemskem grafu farmacevti določijo lastni vrednosti in iz njiju konstante prehajanja.
- **Kemijski reaktorji.** V kaskadi mešalnih reaktorjev ali pri zaporednih reakcijah v reaktorju izberejo čas zadrževanja tik ob $t_{\max}$, da dobijo čim več vmesnega produkta.
- **Konstrukcije.** Nihanje stavbe z več etažami je sistem enačb; lastne vrednosti dajo lastne frekvence, lastni vektorji pa oblike nihanja, ki jih inženir primerja s frekvencami potresa.

## Drugače: Bolj natančno

**Matrična eksponentna funkcija.** Splošna rešitev je $\vec{x}(t) = e^{At}\vec{x}_0$, kjer je $e^{At} = \sum_{k=0}^{\infty}\frac{(At)^k}{k!}$. Za $A = PDP^{-1}$ je $e^{At} = Pe^{Dt}P^{-1}$, $e^{Dt}$ pa diagonalna z elementi $e^{\lambda_it}$. Za nediagonalizabilno $A$ uporabimo Jordanovo obliko; bloki dajo člene $t^ke^{\lambda t}$.

**Nehomogeni sistem.** Za $\dot{\vec{x}} = A\vec{x} + \vec{f}(t)$ je rešitev
$$\vec{x}(t) = e^{At}\vec{x}_0 + \int_0^t e^{A(t - s)}\vec{f}(s)\,\mathrm{d}s,$$
kar je posplošitev integrirajočega množitelja iz enačb prvega reda. Primer: stalen dotok snovi A v reaktor.

**Fazni portret v ravnini.** Za $2 \times 2$ matriko s sledjo $\tau$ in determinanto $\Delta$: $\Delta < 0$ sedlo; $\Delta > 0$ in $\tau^2 > 4\Delta$ vozel (stabilen pri $\tau < 0$); $\tau^2 < 4\Delta$ spirala (stabilna pri $\tau < 0$), pri $\tau = 0$ center. Primer 1 je sedlo, primer 2 stabilna spirala.

## Preveri se

? Kaj v sistemu za A → B → C pomeni lastni vektor $(0, 1, -1)^T$ za lastno vrednost $-k_2$?
- Ravnotežno sestavo, ko se vse pretvori.
~ Ravnotežje je lastni vektor za lastno vrednost $0$, to je $(0, 0, 1)^T$.
+ Način, pri katerem se B pretvarja v C, A pa ga ni.
- Smer, v kateri rešitev neomejeno raste.
~ Lastna vrednost $-k_2$ je negativna, zato ta način pojema, ne raste.
> Pri tem načinu je $a = 0$, B pojema z $e^{-k_2t}$ in za enako se poveča C (vsota komponent je $0$, množina se ohranja).

? Matrike $A_1$, $A_2$, $A_3$ imajo lastne vrednosti $\{-1, -5\}$, $\{-0{,}2; -8\}$ in $\{-2 \pm 3i\}$. Uredi sisteme od najhitrejšega do najpočasnejšega umirjanja.
- $A_2$, $A_3$, $A_1$
~ Odloča najpočasnejši način, ne najhitrejši: pri $A_2$ ostane člen $e^{-0{,}2t}$.
+ $A_3$, $A_1$, $A_2$
- $A_1$, $A_2$, $A_3$
~ Imaginarni del pomeni nihanje, ne počasnejšega umirjanja; ovojnica je $e^{-2t}$.
> Hitrost umirjanja določa največji realni del: $-2$ ($A_3$), $-1$ ($A_1$), $-0{,}2$ ($A_2$).

? Kaj se zgodi z vrhom B v sistemu A → B → C, če $k_2$ močno povečamo pri nespremenjenem $k_1$?
- Vrh se pomakne k poznejšemu času in zviša.
~ Hitrejša razgradnja B ne more povečati njegove največje količine.
+ Vrh se pojavi prej in je nižji, B je ves čas skoraj sorazmeren z $a$.
- Vrh ostane enak, ker je $t_{\max}$ simetričen.
~ Simetrija velja za zamenjavo $k_1 \leftrightarrow k_2$, ne za spremembo ene konstante.
> Pri $k_2 \gg k_1$ velja približek stacionarnega stanja $b \approx \frac{k_1}{k_2}a$; $t_{\max} = \frac{\ln(k_1/k_2)}{k_1 - k_2}$ gre proti $0$.

? Kolikšni sta lastni vrednosti matrike $\begin{pmatrix} -3 & 1 \\ 1 & -3 \end{pmatrix}$?
- $-3$ in $-3$
~ To sta diagonalna elementa; matrika ni trikotna, zato ju ne moreš prebrati z diagonale.
+ $-2$ in $-4$
- $2$ in $4$
~ Predznak: iz $(-3 - \lambda)^2 = 1$ sledi $\lambda = -3 \pm 1$.
- $-3$ in $1$
~ Lastne vrednosti trikotne matrike so na diagonali, ta pa ni trikotna.
> $(-3 - \lambda)^2 - 1 = 0$, $-3 - \lambda = \pm 1$, $\lambda \in \{-2, -4\}$.

? Pri A → B → C je $k_1 = k_2 = 0{,}25\,\mathrm{min^{-1}}$. Kdaj je B največ?
- po $0\,\mathrm{min}$
~ Na začetku B še ni, $b(0) = 0$.
+ po $4{,}0\,\mathrm{min}$
- po $2{,}8\,\mathrm{min}$
~ To je razpolovni čas $\ln 2/k$, ne čas vrha.
- po $8{,}0\,\mathrm{min}$
~ Vrh je pri $t = 1/k$, ne $2/k$.
> Pri enakih konstantah je $b = a_0kt\,e^{-kt}$ in $t_{\max} = 1/k = 4{,}0\,\mathrm{min}$.

:::simboli
\vec{x} | vektor neznanih funkcij | \dot{\vec{x}} = A\vec{x} | | npr. $(a, b, c)$
\vec{x}_0 | začetni vektor | | | $\vec{x}(0)$
\vec{x}_1, \vec{x}_2 | realni rešitvi | |
\vec{v}, \vec{v}_1, \vec{v}_2, \vec{v}_i, \vec{v}_n | lastni vektorji | A\vec{v} = \lambda\vec{v} |
\vec{w} | posplošeni lastni vektor | (A - \lambda I)\vec{w} = \vec{v} |
\vec{p}, \vec{q} | realni in imaginarni del lastnega vektorja | \vec{v} = \vec{p} + i\vec{q} |
\vec{f} | nehomogeni del sistema | |
C_n | konstanta $n$-tega člena | |
e | Eulerjevo število | | | $e \approx 2{,}718$
i | imaginarna enota | | | $i^2 = -1$
A | matrika sistema | | | konstantni koeficienti
\lambda | lastna vrednost | \det(A - \lambda I) = 0 | | v kinetiki $-k$
\lambda_1, \lambda_2, \lambda_i | lastne vrednosti | | 
I | enotska matrika | |
C_1, C_2, C_i | konstante splošne rešitve | | | določi jih začetni pogoj
a, b, c | koncentracije snovi A, B, C | | mol/L
a_0 | začetna koncentracija A | | mol/L
k_1, k_2, k | konstanti hitrosti | | min^{-1}
k_3 | konstanta hitrosti B → D | | h^{-1}
s | vsota $k_2 + k_3$ | s = k_2 + k_3 | h^{-1}
d | koncentracija snovi D | | mol/L
t | čas | | s | v kinetiki min ali h
t_{\max} | čas vrha koncentracije B | t_{\max} = \frac{\ln(k_1/k_2)}{k_1 - k_2} | min
b_{\max} | največja koncentracija B | | mol/L
\alpha | realni del lastne vrednosti | | | ovojnica $e^{\alpha t}$
\beta | imaginarni del lastne vrednosti | | | krožna frekvenca nihanja
y | odmik | | mm
p, q | koeficienta enačbe drugega reda | |
x_1, x_2 | komponenti rešitve | |
\tau | sled matrike | |
\Delta | determinanta matrike | |
:::
