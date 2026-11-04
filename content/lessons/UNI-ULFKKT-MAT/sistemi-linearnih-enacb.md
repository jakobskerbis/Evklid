---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sisteme dveh enačb z dvema neznankama že znaš reševati z vstavljanjem ali s seštevanjem enačb. V naravoslovju in tehniki pa se neznanke množijo: koncentracije več snovi v zmesi, tokovi v razvejenem vezju, sile v paličju, koeficienti pri urejanju kemijske enačbe, pretoki v cevovodu, temperature v točkah mreže pri simulaciji prevajanja toplote. Vse to so **sistemi linearnih enačb**, pogosto z desetinami ali tisoči neznank.

Potrebujemo torej postopek, ki:

- deluje za poljubno število enačb in neznank,
- je sistematičen, da ga lahko izvede tudi računalnik,
- pove ne le rešitev, ampak tudi, **ali** rešitev obstaja in **koliko** jih je.

Ta postopek je **Gaussova eliminacija**. Ključni pojem, ki pove, kaj se s sistemom dogaja, je **rang** matrike. Naučil se boš zapisati sistem z matriko, ga rešiti z Gaussovo eliminacijo, določiti rang in z njim presoditi rešljivost.

## Razlaga

**1. Zapis sistema.** Sistem $m$ linearnih enačb z $n$ neznankami

$$a_{11}x_1 + a_{12}x_2 + \dots + a_{1n}x_n = b_1, \quad \dots, \quad a_{m1}x_1 + \dots + a_{mn}x_n = b_m$$

zapišemo kot $A\vec{x} = \vec{b}$, kjer je $A = [a_{ij}]$ **matrika sistema** ($m \times n$), $\vec{x}$ stolpec neznank in $\vec{b}$ stolpec desnih strani. Če $A$ dopolnimo s stolpcem $\vec{b}$, dobimo **razširjeno matriko** $[A \mid \vec{b}]$. Sistem je **homogen**, če je $\vec{b} = \vec{0}$; tak sistem ima vedno vsaj trivialno rešitev $\vec{x} = \vec{0}$.

**2. Elementarne vrstične operacije.** Množice rešitev ne spremenijo:

1. zamenjava dveh vrstic (enačb),
2. množenje vrstice s številom, **različnim od nič**,
3. prištevanje večkratnika ene vrstice drugi vrstici.

Vsaka operacija je obrnljiva (lahko jo »razveljavimo«), zato iz novega sistema dobimo natanko iste rešitve kot iz starega.

**Trditev.** Če sistem $S'$ dobimo iz sistema $S$ z elementarno vrstično operacijo, imata $S$ in $S'$ isto množico rešitev.

*Dokaz.* Naj $\vec{x}$ reši $S$. Pri zamenjavi vrstic in pri množenju z $\lambda \neq 0$ je očitno rešitev tudi $S'$. Pri operaciji $V_i + \mu V_j$ velja $(\vec{a}_i + \mu \vec{a}_j)\cdot\vec{x} = b_i + \mu b_j$, ker je $\vec{a}_i\cdot\vec{x} = b_i$ in $\vec{a}_j\cdot\vec{x} = b_j$ ($\vec{a}_i$ je $i$-ta vrstica matrike $A$). Torej je vsaka rešitev $S$ rešitev $S'$. Ker $S$ dobimo iz $S'$ z obratno operacijo (zamenjava nazaj, množenje z $\frac{1}{\lambda}$, $V_i - \mu V_j$), velja tudi obratno. $\square$

**3. Gaussova eliminacija.** Z operacijami preoblikujemo razširjeno matriko v **vrstično stopničasto obliko**:

- vse ničelne vrstice so spodaj,
- prvi neničelni element vsake vrstice (**pivot** ali vodilni element) leži desno od pivota vrstice nad njo,
- pod vsakim pivotom so same ničle.

Postopek: v prvem stolpcu izberemo neničelni element (po potrebi zamenjamo vrstici), z njim »pobrišemo« vse elemente pod njim, nato se premaknemo za eno vrstico navzdol in en stolpec desno ter ponovimo. Na koncu sistem rešimo **od spodaj navzgor** (obratno vstavljanje). Če nadaljujemo, dokler vsak pivot ni enak $1$ in nad njim niso same ničle, dobimo **reducirano stopničasto obliko** (Gauss-Jordanova metoda), iz katere rešitev preberemo neposredno.

**4. Rang.** **Definicija.** **Rang** matrike $A$, $\operatorname{rang} A$, je največje število linearno neodvisnih vrstic matrike $A$; enako je največjemu številu linearno neodvisnih stolpcev. Vrstične operacije ranga ne spremenijo (nove vrstice so linearne kombinacije starih in obratno), zato je rang enak številu neničelnih vrstic (pivotov) v kateri koli stopničasti obliki matrike. Velja $\operatorname{rang} A \le \min(m, n)$. Za kvadratno matriko reda $n$ je $\operatorname{rang} A = n$ natanko tedaj, ko je $\det A \neq 0$.

**5. Rešljivost (Kronecker-Capellijev izrek).** Naj bo $A$ matrika velikosti $m \times n$, $\vec{b} \in \mathbb{R}^m$ in $r = \operatorname{rang} A$. Sistem $A\vec{x} = \vec{b}$ je rešljiv natanko tedaj, ko je $\operatorname{rang}[A \mid \vec{b}] = \operatorname{rang} A$. Če je rešljiv, ima pri $r = n$ natanko eno rešitev, pri $r < n$ pa neskončno rešitev z $n - r$ prostimi parametri.

*Dokaz.* Označimo stolpce matrike $A$ z $\vec{s}_1, \dots, \vec{s}_n$. Ker je $A\vec{x} = x_1\vec{s}_1 + \dots + x_n\vec{s}_n$, je sistem rešljiv natanko tedaj, ko je $\vec{b}$ linearna kombinacija stolpcev $A$. To pa velja natanko tedaj, ko dodani stolpec $\vec{b}$ ne poveča največjega števila linearno neodvisnih stolpcev, torej ko je $\operatorname{rang}[A \mid \vec{b}] = \operatorname{rang} A$. Število rešitev odčitamo iz stopničaste oblike: pivotov je $r$, zato je vezanih neznank $r$, prostih pa $n - r$; vsaka izbira prostih neznank da natanko eno rešitev. $\square$

Po primerjavi rangov ločimo tri primere:

- Če je $\operatorname{rang}[A \mid \vec{b}] > \operatorname{rang} A$, sistem **ni rešljiv** (protisloven). V stopničasti obliki se to pokaže kot vrstica $[0 \; 0 \; \cdots \; 0 \mid c]$ s $c \neq 0$, torej enačba $0 = c$.
- Če je $\operatorname{rang}[A \mid \vec{b}] = \operatorname{rang} A = n$, ima sistem **natanko eno rešitev**.
- Če je $\operatorname{rang}[A \mid \vec{b}] = \operatorname{rang} A = r < n$, ima sistem **neskončno rešitev**, ki so odvisne od $n - r$ prostih parametrov.

Neznanke, ki ustrezajo stolpcem s pivoti, so **vezane**, ostale so **proste**: prostim damo poljubne vrednosti (parametre $t$, $s$, …), vezane pa izrazimo z njimi.

**Zgradba množice rešitev.** Naj bo $\vec{x}_p$ ena (partikularna) rešitev sistema $A\vec{x} = \vec{b}$. Potem je $\vec{x}$ rešitev natanko tedaj, ko je $\vec{x} = \vec{x}_p + \vec{x}_h$, kjer je $\vec{x}_h$ rešitev homogenega sistema $A\vec{x} = \vec{0}$. *Dokaz:* $A(\vec{x} - \vec{x}_p) = \vec{b} - \vec{b} = \vec{0}$ in obratno $A(\vec{x}_p + \vec{x}_h) = \vec{b} + \vec{0} = \vec{b}$. $\square$ Homogen sistem ima netrivialne rešitve natanko tedaj, ko je $\operatorname{rang} A < n$; to velja vedno, kadar je enačb manj kot neznank ($r \le m < n$).

**6. Kvadratni sistemi.** Če je $m = n$ in $\det A \neq 0$, ima sistem natanko eno rešitev $\vec{x} = A^{-1}\vec{b}$: matrika $A$ je obrnljiva, zato iz $A\vec{x} = \vec{b}$ z množenjem z $A^{-1}$ z leve sledi $\vec{x} = A^{-1}\vec{b}$, in to je res rešitev. Komponente da **Cramerjevo pravilo** $x_i = \frac{\det A_i}{\det A}$, kjer $A_i$ dobimo iz $A$ tako, da $i$-ti stolpec zamenjamo z $\vec{b}$. Če je $\det A = 0$, sistem nima rešitve ali pa jih ima neskončno; kaj od tega velja, odloči primerjava rangov. Homogen kvadratni sistem ima netrivialno rešitev natanko tedaj, ko je $\det A = 0$.

**7. Geometrijska slika.** Enačba s tremi neznankami predstavlja ravnino v prostoru. Tri ravnine se lahko sekajo v eni točki (ena rešitev), v skupni premici (neskončno rešitev, en parameter), lahko pa nimajo skupne točke (npr. dve sta vzporedni; ni rešitve).

## Rešeni primeri

### Primer 1 (lažji)

Laborant želi pripraviti $600\,\mathrm{g}$ raztopine z masnim deležem soli $20\,\%$ tako, da zmeša raztopino z masnim deležem $10\,\%$ in raztopino z masnim deležem $40\,\%$. Koliko vsake potrebuje? Sistem reši z Gaussovo eliminacijo razširjene matrike.

**Podatki:** skupna masa $600\,\mathrm{g}$, ciljni masni delež $20\,\%$, masna deleža izhodnih raztopin $10\,\%$ in $40\,\%$
**Iščemo:** masi $x$ (raztopina $10\,\%$) in $y$ (raztopina $40\,\%$)

:::formula
Bilanca mase: $x + y = 600$; bilanca soli: $0{,}10\,x + 0{,}40\,y = 0{,}20 \cdot 600$. Razširjena matrika $[A \mid \vec{b}]$ in vrstične operacije.
:::

**Rešitev:**

1. Masa soli v zmesi: $0{,}20 \cdot 600\,\mathrm{g} = 120\,\mathrm{g}$. Sistem: $x + y = 600$, $0{,}1x + 0{,}4y = 120$.
2. Razširjena matrika: $\left[\begin{array}{cc|c} 1 & 1 & 600 \\ 0{,}1 & 0{,}4 & 120 \end{array}\right]$.
3. Drugo vrstico pomnožimo z $10$: $\left[\begin{array}{cc|c} 1 & 1 & 600 \\ 1 & 4 & 1200 \end{array}\right]$.
4. Od druge vrstice odštejemo prvo: $\left[\begin{array}{cc|c} 1 & 1 & 600 \\ 0 & 3 & 600 \end{array}\right]$, torej $3y = 600$ in $y = 200$.
5. Obratno vstavljanje: $x = 600 - 200 = 400$.
6. Preizkus: $0{,}1 \cdot 400 + 0{,}4 \cdot 200 = 40 + 80 = 120$.
7. Odgovor: zmešati mora $400\,\mathrm{g}$ raztopine z $10\,\%$ in $200\,\mathrm{g}$ raztopine s $40\,\%$ soli.

### Primer 2

Z Gaussovo eliminacijo reši sistem in določi rang matrike sistema:
$x + y + z = 6$, $2x - y + z = 3$, $x + 2y - z = 2$.

**Podatki:** enačbe $x + y + z = 6$, $2x - y + z = 3$, $x + 2y - z = 2$ (tri enačbe, tri neznanke)
**Iščemo:** rešitev $(x, y, z)$ in $\operatorname{rang} A$

:::formula
Stopničasta oblika z vrstičnimi operacijami, nato obratno vstavljanje. Ena rešitev, če $\operatorname{rang} A = \operatorname{rang}[A \mid \vec{b}] = n$.
:::

**Rešitev:**

1. $\left[\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 2 & -1 & 1 & 3 \\ 1 & 2 & -1 & 2 \end{array}\right]$
2. $V_2 - 2V_1$ in $V_3 - V_1$: $\left[\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & -3 & -1 & -9 \\ 0 & 1 & -2 & -4 \end{array}\right]$.
3. Zamenjamo $V_2$ in $V_3$ (pivot $1$ je prijaznejši): $\left[\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & 1 & -2 & -4 \\ 0 & -3 & -1 & -9 \end{array}\right]$.
4. $V_3 + 3V_2$: $\left[\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & 1 & -2 & -4 \\ 0 & 0 & -7 & -21 \end{array}\right]$. Trije pivoti, zato $\operatorname{rang} A = \operatorname{rang}[A \mid \vec{b}] = 3 = n$.
5. Obratno vstavljanje: $-7z = -21$, $z = 3$; $y - 2 \cdot 3 = -4$, $y = 2$; $x + 2 + 3 = 6$, $x = 1$.
6. Preizkus: $2 \cdot 1 - 2 + 3 = 3$ in $1 + 4 - 3 = 2$.
7. Odgovor: rang matrike sistema je $3$, sistem ima natanko eno rešitev $x = 1$, $y = 2$, $z = 3$.

### Primer 3 (težji)

Glede na realna parametra $a$ in $b$ razišči rešljivost sistema
$x + 2y - z = 1$, $2x + 5y + z = 4$, $x + 3y + az = b$.
Kdaj ima sistem natanko eno rešitev, kdaj nobene in kdaj neskončno rešitev? V vseh rešljivih primerih zapiši rešitve.

**Podatki:** enačbe $x + 2y - z = 1$, $2x + 5y + z = 4$, $x + 3y + az = b$, parametra $a, b \in \mathbb{R}$
**Iščemo:** pogoje za $a$ in $b$ za vsak tip rešljivosti ter rešitve

:::formula
Kronecker-Capelli: rešljiv $\iff \operatorname{rang} A = \operatorname{rang}[A \mid \vec{b}]$; število prostih parametrov je $n - r$.
:::

**Rešitev:**

1. $\left[\begin{array}{ccc|c} 1 & 2 & -1 & 1 \\ 2 & 5 & 1 & 4 \\ 1 & 3 & a & b \end{array}\right]$
2. $V_2 - 2V_1$ in $V_3 - V_1$: $\left[\begin{array}{ccc|c} 1 & 2 & -1 & 1 \\ 0 & 1 & 3 & 2 \\ 0 & 1 & a + 1 & b - 1 \end{array}\right]$.
3. $V_3 - V_2$: $\left[\begin{array}{ccc|c} 1 & 2 & -1 & 1 \\ 0 & 1 & 3 & 2 \\ 0 & 0 & a - 2 & b - 3 \end{array}\right]$. Uporabili smo le prištevanje večkratnikov vrstic, ki determinante ne spremeni, zato je $\det A = 1 \cdot 1 \cdot (a - 2) = a - 2$.
4. **Primer $a \neq 2$:** trije pivoti, $\operatorname{rang} A = \operatorname{rang}[A \mid \vec{b}] = 3 = n$, natanko ena rešitev za vsak $b$. Obratno vstavljanje: $z = \frac{b - 3}{a - 2}$, $y = 2 - 3z$, $x = 1 - 2y + z = 1 - 4 + 6z + z = -3 + 7z$.
5. Preizkus pri $a = 3$, $b = 4$: $z = 1$, $y = -1$, $x = 4$; $4 - 2 - 1 = 1$, $8 - 5 + 1 = 4$, $4 - 3 + 3 = 4$.
6. **Primer $a = 2$, $b \neq 3$:** zadnja vrstica pomeni $0 = b - 3 \neq 0$; $\operatorname{rang} A = 2 < 3 = \operatorname{rang}[A \mid \vec{b}]$, sistem ni rešljiv.
7. **Primer $a = 2$, $b = 3$:** ranga sta enaka $2 < 3$, en prost parameter. Vzamemo $z = t$. Iz druge vrstice $y = 2 - 3t$, iz prve $x = 1 - 2y + z = 1 - 4 + 6t + t = -3 + 7t$.
8. Preizkus v tretji enačbi ($a = 2$, $b = 3$): $(-3 + 7t) + 3(2 - 3t) + 2t = -3 + 6 + 7t - 9t + 2t = 3$, za vsak $t$.
9. Odgovor: za $a \neq 2$ ima sistem natanko eno rešitev $\left(-3 + 7z,\ 2 - 3z,\ z\right)$ z $z = \frac{b - 3}{a - 2}$; za $a = 2$, $b \neq 3$ ni rešljiv; za $a = 2$, $b = 3$ ima neskončno rešitev $(x, y, z) = (-3 + 7t,\ 2 - 3t,\ t)$, $t \in \mathbb{R}$, in tri ravnine se sekajo v premici.

## Pogoste napake

- **Množenje vrstice z $0$.** To ni dovoljena operacija, ker izbriše enačbo in spremeni množico rešitev. Dovoljeno je množenje le z neničelnim številom.
- **Pozabljen desni stolpec.** Operacijo izvedemo na levi strani, desno stran pa pozabimo spremeniti. Vedno delaj z razširjeno matriko $[A \mid \vec{b}]$ in računaj celo vrstico.
- **Vrstica $[0 \; 0 \; 0 \mid 0]$ pomeni »ni rešitve«.** Ne: to je le odvečna enačba ($0 = 0$). Protislovje pomeni samo vrstica $[0 \; 0 \; 0 \mid c]$ s $c \neq 0$.
- **Napačno štetje prostih parametrov.** Število parametrov je $n - r$ (neznanke minus rang), ne število ničelnih vrstic.
- **»Več enačb kot neznank, torej ni rešitve.«** Število enačb samo po sebi ne odloča; nekatere enačbe so lahko odvisne. Odloča primerjava rangov.
- **Deljenje s parametrom brez preverjanja.** Če pri parametričnem sistemu deliš z $a - 2$, moraš primer $a = 2$ obravnavati posebej (v Primeru 3 se tam razcepi še na $b = 3$ in $b \neq 3$).

## Povzetek

- Sistem zapišemo kot $A\vec{x} = \vec{b}$ in delamo z razširjeno matriko $[A \mid \vec{b}]$.
- Elementarne vrstične operacije (zamenjava, množenje z $\lambda \neq 0$, prištevanje večkratnika) ne spremenijo rešitev.
- Gaussova eliminacija: stopničasta oblika, nato obratno vstavljanje; Gauss-Jordan: reducirana oblika.
- Rang je število pivotov v stopničasti obliki.
- Kronecker-Capelli: rešljiv $\iff \operatorname{rang} A = \operatorname{rang}[A \mid \vec{b}] = r$; pri $r = n$ ena rešitev, pri $r < n$ neskončno rešitev z $n - r$ parametri.
- Kvadratni sistem z $\det A \neq 0$ ima natanko eno rešitev.

## Za izpit

Znati moraš povedati:

- definicijo ranga matrike in zakaj ga elementarne vrstične operacije ne spremenijo,
- trditev, da elementarne vrstične operacije ohranjajo množico rešitev, z dokazom,
- Kronecker-Capellijev izrek z vsemi primeri ($r = n$, $r < n$, protislovje) in dokaz prek linearne kombinacije stolpcev,
- zgradbo množice rešitev $\vec{x} = \vec{x}_p + \vec{x}_h$ z dokazom,
- kdaj ima homogen sistem netrivialno rešitev ($\operatorname{rang} A < n$; pri kvadratnem $\det A = 0$),
- zakaj ima kvadratni sistem z $\det A \neq 0$ natanko eno rešitev, in Cramerjevo pravilo.

### Naloga 1

Dan je sistem s parametroma $\lambda, \mu \in \mathbb{R}$:
$x_1 + x_2 + x_3 + x_4 = 2$, $x_1 + 2x_2 + 3x_3 + 4x_4 = 5$, $2x_1 + 3x_2 + 4x_3 + \lambda x_4 = \mu$.

a) V odvisnosti od $\lambda$ in $\mu$ določi $\operatorname{rang} A$ in $\operatorname{rang}[A \mid \vec{b}]$ ter zapiši splošno rešitev, kadar je sistem rešljiv.
b) Pri $\lambda = 5$ in $\mu = 7$ poišči tisto rešitev, pri kateri je $x_1 = 0$ in $x_2 = 0$.

**Rešitev:**

1. $\left[\begin{array}{cccc|c} 1 & 1 & 1 & 1 & 2 \\ 1 & 2 & 3 & 4 & 5 \\ 2 & 3 & 4 & \lambda & \mu \end{array}\right]$; $V_2 - V_1$ in $V_3 - 2V_1$: $\left[\begin{array}{cccc|c} 1 & 1 & 1 & 1 & 2 \\ 0 & 1 & 2 & 3 & 3 \\ 0 & 1 & 2 & \lambda - 2 & \mu - 4 \end{array}\right]$.
2. $V_3 - V_2$: $\left[\begin{array}{cccc|c} 1 & 1 & 1 & 1 & 2 \\ 0 & 1 & 2 & 3 & 3 \\ 0 & 0 & 0 & \lambda - 5 & \mu - 7 \end{array}\right]$.
3. **$\lambda \neq 5$:** pivoti so v stolpcih $1$, $2$ in $4$, $\operatorname{rang} A = \operatorname{rang}[A \mid \vec{b}] = 3$ za vsak $\mu$, prost je $4 - 3 = 1$ parameter. Iz zadnje vrstice $x_4 = q$, kjer je $q = \frac{\mu - 7}{\lambda - 5}$; $x_3 = t$; $x_2 = 3 - 2t - 3q$; $x_1 = 2 - (3 - 2t - 3q) - t - q = -1 + t + 2q$.
4. Preizkus v tretji enačbi: $2(-1 + t + 2q) + 3(3 - 2t - 3q) + 4t + \lambda q = 7 + (\lambda - 5)q = 7 + \mu - 7 = \mu$.
5. **$\lambda = 5$, $\mu \neq 7$:** zadnja vrstica pomeni $0 = \mu - 7 \neq 0$; $\operatorname{rang} A = 2 < 3 = \operatorname{rang}[A \mid \vec{b}]$, sistem ni rešljiv.
6. **$\lambda = 5$, $\mu = 7$:** zadnja vrstica je ničelna, $\operatorname{rang} A = \operatorname{rang}[A \mid \vec{b}] = 2$, prosta sta $4 - 2 = 2$ parametra: $x_3 = t$, $x_4 = s$, $x_2 = 3 - 2t - 3s$, $x_1 = 2 - (3 - 2t - 3s) - t - s = -1 + t + 2s$.
7. b) Zahtevamo $-1 + t + 2s = 0$ in $3 - 2t - 3s = 0$. Iz prve $t = 1 - 2s$, vstavimo v drugo: $3 - 2 + 4s - 3s = 0$, torej $s = -1$ in $t = 3$.
8. Preizkus rešitve $(0, 0, 3, -1)$: $3 - 1 = 2$, $9 - 4 = 5$, $12 - 5 = 7$.
9. Odgovor: za $\lambda \neq 5$ je $\operatorname{rang} A = \operatorname{rang}[A \mid \vec{b}] = 3$ in rešitve so $(-1 + t + 2q,\ 3 - 2t - 3q,\ t,\ q)$ s $q = \frac{\mu - 7}{\lambda - 5}$, $t \in \mathbb{R}$; za $\lambda = 5$, $\mu \neq 7$ sistem ni rešljiv; za $\lambda = 5$, $\mu = 7$ sta ranga $2$ in rešitve so $(-1 + t + 2s,\ 3 - 2t - 3s,\ t,\ s)$, $t, s \in \mathbb{R}$. Iskana rešitev v b) je $(0, 0, 3, -1)$.

### Naloga 2

Natančno navedi Kronecker-Capellijev izrek in dokaži, da je sistem $A\vec{x} = \vec{b}$ rešljiv natanko tedaj, ko je $\operatorname{rang}[A \mid \vec{b}] = \operatorname{rang} A$. Nato utemelji, ali ima lahko sistem treh enačb s petimi neznankami natanko eno rešitev in ali ima lahko homogen tak sistem samo trivialno rešitev.

**Rešitev:**

1. Izrek: naj bo $A$ matrika $m \times n$ in $\vec{b} \in \mathbb{R}^m$. Sistem je rešljiv natanko tedaj, ko je $\operatorname{rang}[A \mid \vec{b}] = \operatorname{rang} A = r$; tedaj ima pri $r = n$ natanko eno rešitev, pri $r < n$ pa neskončno rešitev z $n - r$ parametri.
2. Dokaz: $A\vec{x} = x_1\vec{s}_1 + \dots + x_n\vec{s}_n$, kjer so $\vec{s}_j$ stolpci matrike $A$. Rešitev obstaja natanko tedaj, ko je $\vec{b}$ linearna kombinacija stolpcev.
3. Če je $\vec{b}$ linearna kombinacija stolpcev, dodani stolpec ni linearno neodvisen od njih in rang se ne poveča. Če ni, je največja neodvisna množica stolpcev $A$, dopolnjena z $\vec{b}$, še vedno neodvisna, zato je $\operatorname{rang}[A \mid \vec{b}] = \operatorname{rang} A + 1$. $\square$
4. Sistem treh enačb s petimi neznankami: $r \le \min(3, 5) = 3 < 5$. Če je rešljiv, ima vsaj $5 - 3 = 2$ prosta parametra, torej neskončno rešitev; natanko ene rešitve ne more imeti (lahko pa je protisloven).
5. Homogen sistem je vedno rešljiv ($\vec{x} = \vec{0}$), in ker je $r \le 3 < 5$, ima še netrivialne rešitve.
6. Odgovor: natanko ene rešitve tak sistem ne more imeti; homogen tak sistem ima vedno netrivialne rešitve.

## Drugače: Na sliki

Pri dveh neznankah je vsaka enačba premica v ravnini. Možnosti so tri:

```
 ena rešitev          ni rešitve           neskončno rešitev
     \   /             ______              ______
      \ /              ______              ======  (premici
       X  (presečišče)  (vzporedni)                 sovpadata)
      / \
```

- Premici se sekata: $\operatorname{rang} A = \operatorname{rang}[A \mid \vec{b}] = 2$.
- Premici sta vzporedni in različni: $\operatorname{rang} A = 1$, $\operatorname{rang}[A \mid \vec{b}] = 2$.
- Premici sovpadata: oba ranga sta $1$, en prost parameter.

Pri treh neznankah so enačbe ravnine. V Primeru 3 je pri $a \neq 2$ presečišče treh ravnin ena točka. Pri $a = 2$ je $\operatorname{rang} A = 2$: tri ravnine pri $b = 3$ gredo skozi isto premico (kot listi odprte knjige okoli hrbta), pri $b \neq 3$ pa se vsak par ravnin seka v svoji premici, vse tri skupaj pa nimajo skupne točke (kot tri stranice trikotne prizme).

## Drugače: Uporaba v stroki

**Urejanje kemijske enačbe.** Pri gorenju propana iščemo koeficiente v $a\,\mathrm{C_3H_8} + b\,\mathrm{O_2} \to c\,\mathrm{CO_2} + d\,\mathrm{H_2O}$. Ohranitev atomov da homogen sistem: ogljik $3a = c$, vodik $8a = 2d$, kisik $2b = 2c + d$. Neznanke so štiri, rang matrike sistema je $3$, zato je en prost parameter: rešitve so večkratniki ene same. Izberemo $a = 1$: $c = 3$, $d = 4$, $2b = 6 + 4 = 10$, $b = 5$. Enačba $\mathrm{C_3H_8} + 5\,\mathrm{O_2} \to 3\,\mathrm{CO_2} + 4\,\mathrm{H_2O}$ je urejena, prost parameter pa pove, da lahko vse koeficiente pomnožimo z istim številom.

**Spektrofotometrična analiza zmesi.** Absorbanca zmesi je po Beer-Lambertovem zakonu vsota prispevkov komponent: pri valovni dolžini $\lambda_i$ je $A_i = \ell\sum_j \varepsilon_{ij} c_j$, kjer je $\ell$ debelina kivete in $\varepsilon_{ij}$ molarni absorpcijski koeficient $j$-te komponente. Če absorbanco izmerimo pri toliko valovnih dolžinah, kolikor je komponent, dobimo kvadratni sistem za koncentracije $c_j$. Če sta spektra dveh komponent skoraj sorazmerna, je matrika skoraj singularna in sistem slabo pogojen: majhna merska napaka absorbance močno spremeni izračunani koncentraciji. Zato v laboratoriju izberemo valovne dolžine, pri katerih se spektra čim bolj razlikujeta.

**Stehiometrija reakcijskih sistemov.** V reaktorju z več hkratnimi reakcijami zapišemo stehiometrijske koeficiente v matriko (vrstice so reakcije, stolpci snovi). Število neodvisnih reakcij je rang te matrike; samo toliko reakcijskih dosegov moramo spremljati, ostale sestave sledijo iz masnih bilanc.

**Masne bilance procesov.** Pri mešanju, destilaciji ali ekstrakciji vsaka komponenta v vsakem vozlišču procesne sheme da linearno bilanco (vstopi = izstopi). Inženir iz ranga sistema ugotovi, ali izmerjeni tokovi zadoščajo za izračun neizmerjenih ali pa je treba dodati merilno mesto.

## Drugače: Korak za korakom s številkami

Reši $3x + 2y = 7$, $x - y = -1$ z Gauss-Jordanovo metodo.

1. Razširjena matrika: $\left[\begin{array}{cc|c} 3 & 2 & 7 \\ 1 & -1 & -1 \end{array}\right]$.
2. Zamenjamo vrstici, da je pivot $1$: $\left[\begin{array}{cc|c} 1 & -1 & -1 \\ 3 & 2 & 7 \end{array}\right]$.
3. $V_2 - 3V_1$: $3 - 3 = 0$, $2 - 3 \cdot (-1) = 5$, $7 - 3 \cdot (-1) = 10$. Dobimo $\left[\begin{array}{cc|c} 1 & -1 & -1 \\ 0 & 5 & 10 \end{array}\right]$.
4. $V_2 : 5$: $\left[\begin{array}{cc|c} 1 & -1 & -1 \\ 0 & 1 & 2 \end{array}\right]$.
5. $V_1 + V_2$ (ničla nad pivotom): $\left[\begin{array}{cc|c} 1 & 0 & 1 \\ 0 & 1 & 2 \end{array}\right]$.
6. Preberemo: $x = 1$, $y = 2$.
7. Preizkus: $3 \cdot 1 + 2 \cdot 2 = 7$ in $1 - 2 = -1$. Rang je $2 = n$, rešitev je ena sama.

Enak postopek z matriko $[A \mid I]$ namesto $[A \mid \vec{b}]$ da inverzno matriko $A^{-1}$.

## Drugače: Bolj natančno

**Zakaj vrstične operacije ohranjajo rešitve.** Vsaka elementarna operacija je množenje z leve z obrnljivo **elementarno matriko** $E$. Iz $A\vec{x} = \vec{b}$ sledi $EA\vec{x} = E\vec{b}$, iz tega pa z množenjem z $E^{-1}$ spet $A\vec{x} = \vec{b}$. Sistema sta torej ekvivalentna. Gaussova eliminacija da $PA = LU$ (permutacijska, spodnje in zgornje trikotna matrika), kar je osnova numeričnih knjižnic.

**Struktura množice rešitev.** Naj bo $\vec{x}_p$ ena (partikularna) rešitev sistema $A\vec{x} = \vec{b}$. Potem je vsaka rešitev oblike $\vec{x} = \vec{x}_p + \vec{x}_h$, kjer je $\vec{x}_h$ rešitev homogenega sistema $A\vec{x} = \vec{0}$. Dokaz: $A(\vec{x} - \vec{x}_p) = \vec{b} - \vec{b} = \vec{0}$. Rešitve homogenega sistema tvorijo vektorski podprostor (jedro, $\ker A$) dimenzije $n - \operatorname{rang} A$ (izrek o rangu in ničnosti). V Primeru 3 ($a = 2$, $b = 3$) je $\vec{x}_p = (-3, 2, 0)$, jedro pa je premica, ki jo razpenja $(7, -3, 1)$.

**Kronecker-Capellijev izrek.** $A\vec{x} = \vec{b}$ je rešljiv natanko tedaj, ko je $\vec{b}$ linearna kombinacija stolpcev matrike $A$, saj je $A\vec{x} = x_1\vec{s}_1 + \dots + x_n\vec{s}_n$ ($\vec{s}_j$ so stolpci). To pomeni, da dodajanje stolpca $\vec{b}$ ne poveča dimenzije prostora stolpcev, torej $\operatorname{rang}[A \mid \vec{b}] = \operatorname{rang} A$.

**Numerična opomba.** Pri računanju s plavajočo vejico izbiramo za pivot element z največjo absolutno vrednostjo v stolpcu (**delno pivotiranje**). Deljenje z zelo majhnim pivotom namreč močno poveča zaokrožitvene napake. Sistemi s skoraj singularno matriko (vrstice so skoraj linearno odvisne) so **slabo pogojeni**: majhna sprememba podatkov (npr. merska napaka) povzroči veliko spremembo rešitve. Majhna determinanta sama po sebi tega še ne pomeni: matrika $0{,}1\,I$ reda $10$ ima $\det = 10^{-10}$, pa je odlično pogojena.

## Preveri se

? Po Gaussovi eliminaciji ima sistem $\operatorname{rang} A = 2$ in $\operatorname{rang}[A \mid \vec{b}] = 3$. Kaj velja?
- Sistem ima natanko eno rešitev.
- Sistem ima neskončno rešitev z enim parametrom.
+ Sistem ni rešljiv.
> Rang razširjene matrike je večji, kar pomeni vrstico oblike $0 = c$ s $c \neq 0$, torej protislovje.

? Sistem s $4$ neznankami ima $\operatorname{rang} A = \operatorname{rang}[A \mid \vec{b}] = 2$. Koliko prostih parametrov ima splošna rešitev?
- $0$
+ $2$
- $4$
> Število prostih parametrov je $n - r = 4 - 2 = 2$.

? Katera operacija na razširjeni matriki **ni** dovoljena?
- zamenjava dveh vrstic
- prištevanje trikratnika prve vrstice drugi vrstici
+ množenje vrstice z $0$
> Množenje z $0$ izbriše enačbo in ga ni mogoče razveljaviti, zato lahko spremeni množico rešitev.

? Kaj je rešitev sistema $x + y = 5$, $x - y = 1$?
- $x = 2$, $y = 3$
+ $x = 3$, $y = 2$
- $x = 4$, $y = 1$
> Seštejemo enačbi: $2x = 6$, $x = 3$, nato $y = 5 - 3 = 2$. Preizkus: $3 - 2 = 1$.

:::simboli
a_{11}, a_{12}, a_{1n}, a_{m1}, a_{mn} | koeficienti sistema (elementi matrike A) | | | aᵢⱼ: i-ta enačba, j-ta neznanka
x_1, x_2, x_n | neznanke sistema | | |
b_1, b_m | desne strani enačb | | |
x | masa raztopine z deležem 10 % | | g |
y | masa raztopine z deležem 40 % | | g |
A | matrika sistema | | | razsežnost m × n
\vec{b} | stolpec desnih strani | | |
n | število neznank | | |
r | rang matrike sistema | r = \operatorname{rang} A | | n − r je število prostih parametrov
:::
