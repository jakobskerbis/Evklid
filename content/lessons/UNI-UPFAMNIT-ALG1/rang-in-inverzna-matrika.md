---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec pri vajah pokaže matriko

$$A = \begin{pmatrix} 1 & 2 & -1 & 3 \\ 2 & 4 & 1 & 0 \\ 3 & 6 & 0 & 3 \end{pmatrix}$$

in reče: »Nobena vrstica ni ničelna in nobeni dve nista enaki ali sorazmerni. Rang je torej $3$.« Zveni prepričljivo. Pa vendar se moti: tretja vrstica je vsota prvih dveh. Ena od treh vrstic ne prinese nič novega in rang je $2$.

Kako to opaziš, ne da bi ugibal? In zakaj je to pomembno? Pri analizi električnega omrežja z $n$ vozlišči zapišemo tokove in napetosti kot $G\vec{U} = \vec{J}$. Napetosti vozlišč dobimo kot $\vec{U} = G^{-1}\vec{J}$, a samo, če inverz obstaja. Če ima $G$ rang manjši od $n$, je omrežje »plavajoče« in napetosti niso določene. Oboje, rang in inverz, izračunamo z istim orodjem: z **elementarnimi transformacijami** vrstic.

## Razlaga

**1. Staro in novo drug ob drugem.** Iz lekcije o determinantah veš, da je kvadratna matrika obrnljiva natanko tedaj, ko je $\det A \neq 0$. Determinanta torej odgovori z »da« ali »ne«. Rang pove več in velja za vsako matriko, tudi nekvadratno.

- **Determinanta:** samo za kvadratne matrike; eno število; pove le, ali so vrstice neodvisne.
- **Rang:** za vsako matriko $m \times n$; celo število med $0$ in $\min(m, n)$; pove, *koliko* vrstic je neodvisnih.
- **Inverz s prirejenko:** formula $A^{-1} = \frac{1}{\det A}\operatorname{adj} A$ zahteva $n^2$ poddeterminant; za $n = 4$ je to že $16$ determinant reda $3$.
- **Inverz z Gaussovo metodo:** isti postopek kot pri rangu, le na razširjeni shemi $[A \mid I]$.

**2. Elementarne transformacije.**

**Definicija.** Elementarne transformacije vrstic matrike so:
- (T1) zamenjava dveh vrstic, $V_i \leftrightarrow V_j$;
- (T2) množenje vrstice z neničelnim številom, $V_i \leftarrow c\,V_i$, $c \neq 0$;
- (T3) prištevanje večkratnika druge vrstice, $V_i \leftarrow V_i + c\,V_j$, $i \neq j$.

Vsaka transformacija je obrnljiva: zamenjavo ponovimo, $c$ zamenjamo z $\frac{1}{c}$, $c$ zamenjamo z $-c$. Matriki, ki ju povezuje zaporedje elementarnih transformacij, imenujemo **ekvivalentni** in pišemo $A \sim B$.

Vsaka transformacija je tudi množenje z leve z **elementarno matriko** $E$. To je enotska matrika $I$, na kateri smo naredili isto transformacijo. Za $3 \times 3$ in $V_2 \leftarrow V_2 - 2V_1$ je

$$E = \begin{pmatrix} 1 & 0 & 0 \\ -2 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}.$$

**3. Stopničasta oblika.** Matrika je v **vrstični stopničasti obliki**, če so ničelne vrstice na dnu in je prvi neničelni element (**pivot**) vsake vrstice desno od pivota vrstice nad njo. Pod pivoti so same ničle. Skica (■ je pivot, * karkoli):

```
[ ■ * * * ]
[ 0 0 ■ * ]
[ 0 0 0 0 ]
```

Z Gaussovo eliminacijo pride vsaka matrika v stopničasto obliko. Če nadaljujemo, da so pivoti enaki $1$ in nad njimi tudi ničle, dobimo **reducirano** stopničasto obliko (Gauss-Jordanova metoda).

**4. Rang.**

**Definicija.** Rang matrike $A$, $\operatorname{rang} A$, je največje število linearno neodvisnih vrstic matrike $A$.

**Izrek.** Elementarne transformacije vrstic ne spremenijo ranga. Zato je rang enak številu neničelnih vrstic v (poljubni) stopničasti obliki matrike.

**Dokaz.** Pri T1 in T2 je jasno, da se množica vseh linearnih kombinacij vrstic (vrstični prostor) ne spremeni. Pri T3 je nova vrstica $V_i + cV_j$ kombinacija starih, stara $V_i = (V_i + cV_j) - cV_j$ pa kombinacija novih. Prostor je enak, zato je enaka tudi največja množica neodvisnih vrstic. V stopničasti obliki so neničelne vrstice neodvisne: v stolpcu pivota prve neničelne vrstice imajo vse nižje vrstice ničlo, zato mora biti njen koeficient v vsaki ničelni kombinaciji $0$; nato isto sklepamo za drugo vrstico in tako naprej. $\blacksquare$

Velja tudi, da je vrstični rang enak stolpčnemu (dokaz v razdelku »Bolj natančno«), zato je $\operatorname{rang} A = \operatorname{rang} A^T$.

:::premisli
Matrika ima $3$ vrstice in $5$ stolpcev. Ali je lahko njen rang $4$? Odgovori brez računanja.
---
Ne. Rang je število neodvisnih vrstic, vrstic pa so samo $3$. V splošnem je $\operatorname{rang} A \le \min(m, n)$.
:::

**5. Inverz z Gaussovo metodo.**

**Izrek.** Za kvadratno matriko $A$ reda $n$ so enakovredne trditve: (a) $A$ je obrnljiva; (b) $\operatorname{rang} A = n$; (c) $\det A \neq 0$; (d) $A \sim I$.

Zamisel je preprosta. Če zaporedje transformacij $E_k \cdots E_2 E_1$ spremeni $A$ v $I$, je $E_k \cdots E_1 A = I$, torej je $E_k \cdots E_1 = A^{-1}$. Iste transformacije na $I$ dajo ravno ta produkt. Zato zapišemo razširjeno shemo in jo preoblikujemo do konca:

$$[\,A \mid I\,] \sim \cdots \sim [\,I \mid A^{-1}\,].$$

Če se na levi pojavi ničelna vrstica, je $\operatorname{rang} A < n$ in inverz ne obstaja. Postopek tedaj ustavimo.

:::premisli
Na desni strani sheme si se pri eni transformaciji uštel, leva stran pa je prav prišla do $I$. Kako napako ujameš na koncu, ne da bi ponavljal ves račun?
---
Izračunaj produkt $A B$, kjer je $B$ dobljena desna stran. Če je napaka, $AB \neq I$. Preizkus stane eno množenje matrik in ujame vsako napako na desni.
:::

**6. Koliko dela.** Gauss-Jordan za matriko reda $n$ potrebuje okoli $n^3$ množenj. Za $n = 10$ je to približno $1000$, s prirejenko pa bi računali $100$ determinant reda $9$. Zato računalniki inverze in range vedno računajo z eliminacijo.

## Rešeni primeri

### Primer 1 (lažji): rang sošolčeve matrike

Določi rang matrike iz uvoda.

**Podatki:** $A = \begin{pmatrix} 1 & 2 & -1 & 3 \\ 2 & 4 & 1 & 0 \\ 3 & 6 & 0 & 3 \end{pmatrix}$, matrika $3 \times 4$
**Iščemo:** $\operatorname{rang} A$

:::formula
$\operatorname{rang} A$ = število neničelnih vrstic v stopničasti obliki; transformacije T1–T3 ga ne spremenijo
:::

**Rešitev:**

1. Pod pivotom $1$ v prvem stolpcu naredimo ničle: $V_2 \leftarrow V_2 - 2V_1$ da $(0, 0, 3, -6)$, ker je $4 - 2 \cdot 2 = 0$ in $1 - 2 \cdot (-1) = 3$.
2. $V_3 \leftarrow V_3 - 3V_1$ da $(0, 0, 3, -6)$, ker je $0 - 3 \cdot (-1) = 3$ in $3 - 3 \cdot 3 = -6$.
3. Drugi stolpec je pod prvo vrstico ves ničeln, zato je naslednji pivot $3$ v tretjem stolpcu. $V_3 \leftarrow V_3 - V_2$ da ničelno vrstico.
4. Stopničasta oblika ima dve neničelni vrstici: $(1, 2, -1, 3)$ in $(0, 0, 3, -6)$.
5. Odgovor: $\operatorname{rang} A = 2$. Sošolčev sklep »ni enakih vrstic, torej rang $3$« je napačen, ker vrstica lahko leži v ravnini drugih dveh, ne da bi bila kateri od njiju sorazmerna.

### Primer 2: inverz matrike prevodnosti

Štirje upori po $1\,\Omega$ so vezani zaporedno med maso, vozlišči $1$, $2$, $3$ in spet maso. Metoda vozliščnih potencialov da matriko prevodnosti $G$ (v siemensih). Izračunaj $G^{-1}$.

**Podatki:** $G = \begin{pmatrix} 2 & -1 & 0 \\ -1 & 2 & -1 \\ 0 & -1 & 2 \end{pmatrix}\,\mathrm{S}$
**Iščemo:** $G^{-1}$ (v ohmih)

:::formula
$[\,G \mid I\,] \sim \cdots \sim [\,I \mid G^{-1}\,]$
:::

**Rešitev:**

1. Shema: $\left(\begin{array}{ccc|ccc} 2 & -1 & 0 & 1 & 0 & 0 \\ -1 & 2 & -1 & 0 & 1 & 0 \\ 0 & -1 & 2 & 0 & 0 & 1 \end{array}\right)$.
2. $V_2 \leftarrow 2V_2 + V_1$ odstrani $-1$ pod prvim pivotom: druga vrstica postane $(0, 3, -2 \mid 1, 2, 0)$.
3. $V_3 \leftarrow 3V_3 + V_2$: tretja vrstica postane $(0, 0, 4 \mid 1, 2, 3)$, ker je $3 \cdot 2 - 2 = 4$. Leva stran je zgornjetrikotna z neničelnimi pivoti, zato je rang $3$ in inverz obstaja.
4. $V_3 \leftarrow \frac{1}{4}V_3$: $(0, 0, 1 \mid \frac{1}{4}, \frac{1}{2}, \frac{3}{4})$.
5. $V_2 \leftarrow \frac{1}{3}(V_2 + 2V_3)$: desno je $\frac{1}{3}(1 + \frac{1}{2},\ 2 + 1,\ \frac{3}{2}) = (\frac{1}{2}, 1, \frac{1}{2})$, levo $(0, 1, 0)$.
6. $V_1 \leftarrow \frac{1}{2}(V_1 + V_2)$: desno $\frac{1}{2}(1 + \frac{1}{2},\ 1,\ \frac{1}{2}) = (\frac{3}{4}, \frac{1}{2}, \frac{1}{4})$, levo $(1, 0, 0)$.
7. Preizkus prve vrstice produkta: $2 \cdot \frac{3}{4} - 1 \cdot \frac{1}{2} = 1$ in $2 \cdot \frac{1}{2} - 1 \cdot 1 = 0$. Drži.
8. Odgovor: $G^{-1} = \dfrac{1}{4}\begin{pmatrix} 3 & 2 & 1 \\ 2 & 4 & 2 \\ 1 & 2 & 3 \end{pmatrix}\,\Omega$. Inverz je spet simetričen, kot $G$.

### Primer 3 (težji, izpitna raven): rang s parametrom

Za vsak realen $a$ določi rang matrike $A = \begin{pmatrix} 1 & 1 & a \\ 1 & a & 1 \\ a & 1 & 1 \end{pmatrix}$. Za katere $a$ je $A$ obrnljiva? Izračunaj $A^{-1}$ pri $a = 0$.

**Podatki:** matrika $A$ s parametrom $a \in \mathbb{R}$; za inverz $a = 0$
**Iščemo:** $\operatorname{rang} A$ v odvisnosti od $a$, pogoj obrnljivosti, $A^{-1}$ pri $a = 0$

:::formula
$\operatorname{rang} A$ = število neničelnih vrstic v stopničasti obliki; $A$ obrnljiva $\iff \operatorname{rang} A = 3$; $[\,A \mid I\,] \sim [\,I \mid A^{-1}\,]$
:::

**Rešitev:**

1. Prva vrstica ima pivot $1$ za vsak $a$, zato z njo začnemo in se izognemo deljenju s parametrom.
2. $V_2 \leftarrow V_2 - V_1$: $(0,\ a - 1,\ 1 - a)$. $V_3 \leftarrow V_3 - aV_1$: $(0,\ 1 - a,\ 1 - a^2)$.
3. $V_3 \leftarrow V_3 + V_2$: $(0,\ 0,\ (1 - a) + (1 - a^2))$, in $2 - a - a^2 = (1 - a)(a + 2)$.
4. Primer $a = 1$: druga in tretja vrstica sta ničelni, zato je rang $1$ (vse vrstice so enake $(1, 1, 1)$).
5. Primer $a = -2$: druga vrstica je $(0, -3, 3)$, tretja ničelna, zato je rang $2$.
6. Sicer sta $a - 1 \neq 0$ in $(1 - a)(a + 2) \neq 0$, pivoti so trije in rang je $3$. Matrika je obrnljiva natanko za $a \neq 1$ in $a \neq -2$. (Za preizkus: $\det A = -(a - 1)^2(a + 2)$.)
7. Pri $a = 0$ shemo začnemo z $V_1 \leftrightarrow V_2$, ker je zgoraj levo $0$: $\left(\begin{array}{ccc|ccc} 1 & 0 & 1 & 0 & 1 & 0 \\ 0 & 1 & 1 & 1 & 0 & 0 \\ 1 & 1 & 0 & 0 & 0 & 1 \end{array}\right)$.
8. $V_3 \leftarrow V_3 - V_1 - V_2$: $(0, 0, -2 \mid -1, -1, 1)$, nato $V_3 \leftarrow -\frac{1}{2}V_3$: $(0, 0, 1 \mid \frac{1}{2}, \frac{1}{2}, -\frac{1}{2})$.
9. $V_1 \leftarrow V_1 - V_3$ in $V_2 \leftarrow V_2 - V_3$ dasta $(1, 0, 0 \mid -\frac{1}{2}, \frac{1}{2}, \frac{1}{2})$ in $(0, 1, 0 \mid \frac{1}{2}, -\frac{1}{2}, \frac{1}{2})$.
10. Odgovor: $\operatorname{rang} A = 1$ pri $a = 1$, $2$ pri $a = -2$ in $3$ sicer; obrnljiva je za $a \notin \{1, -2\}$. Pri $a = 0$ je $A^{-1} = \dfrac{1}{2}\begin{pmatrix} -1 & 1 & 1 \\ 1 & -1 & 1 \\ 1 & 1 & -1 \end{pmatrix}$.

### Primer 4 – zdaj ti: napetosti vozlišč

V omrežju iz Primera 2 v vozlišče $1$ vbrizgamo tok $4\,\mathrm{A}$, v drugi vozlišči nič. Nato poskus ponovimo s $4\,\mathrm{A}$ v vozlišče $2$. Izračunaj napetosti vozlišč proti masi.

**Podatki:** $G^{-1} = \frac{1}{4}\begin{pmatrix} 3 & 2 & 1 \\ 2 & 4 & 2 \\ 1 & 2 & 3 \end{pmatrix}\,\Omega$; $\vec{J}_a = (4, 0, 0)\,\mathrm{A}$; $\vec{J}_b = (0, 4, 0)\,\mathrm{A}$
**Iščemo:** $\vec{U}_a$ in $\vec{U}_b$

:::formula
$\vec{U} = G^{-1}\vec{J}$
:::

**Rešitev:**

1. Ko je inverz enkrat izračunan, je vsak nov poskus le eno množenje. Zato se izplača.
2. Pri $\vec{J}_a$ je od produkta ostal le prvi stolpec $G^{-1}$, pomnožen s $4$: $\vec{U}_a = (3, 2, 1)\,\mathrm{V}$.
3. Fizikalni preizkus: iz vozlišča $1$ tok teče k masi prek $1\,\Omega$ in prek treh uporov ($3\,\Omega$). Vzporedno je to $0{,}75\,\Omega$, in $4 \cdot 0{,}75 = 3$. Drži.
4. Zdaj izračunaj $\vec{U}_b$ sam.

:::premisli
Koliko je $\vec{U}_b$ in zakaj je napetost vozlišča $2$ večja kot $U_1$ v prvem poskusu?
---
$\vec{U}_b$ je drugi stolpec $G^{-1}$ krat $4$: $\vec{U}_b = (2, 4, 2)\,\mathrm{V}$. Vozlišče $2$ vidi proti masi dve veji po $2\,\Omega$, vzporedno $1\,\Omega$, zato je $U_2 = 4 \cdot 1 = 4\,\mathrm{V}$. Vozlišče $1$ je bilo prek $1\,\Omega$ neposredno na masi, zato je bilo nižje.
:::

## Pogoste napake

- **»Ni enakih vrstic, torej je rang poln.«** Odvisnost lahko vključuje tri ali več vrstic hkrati, kot v Primeru 1. Edini zanesljiv način je stopničasta oblika.
- **Transformacija samo na levi strani sheme.** Kdor pri $[A \mid I]$ preoblikuje le $A$, na desni ne dobi $A^{-1}$. Vsaka transformacija se izvede na celi vrstici, levo in desno od črte.
- **Mešanje vrstičnih in stolpčnih transformacij pri inverzu.** Za rang smeš uporabiti oboje, ker je vrstični rang enak stolpčnemu. Pri Gauss-Jordanu za $A^{-1}$ pa samo vrstice: stolpčna transformacija pomeni množenje z desne in pokvari zvezo $E_k \cdots E_1 A = I$.
- **Množenje vrstice z nič ali s parametrom.** $V_i \leftarrow 0 \cdot V_i$ ni elementarna transformacija, saj ni obrnljiva. Tudi $V_i \leftarrow (a - 1)V_i$ je dovoljena le za $a \neq 1$; primer $a = 1$ obravnavaj posebej.
- **Inverz produkta v napačnem vrstnem redu.** $(AB)^{-1} = B^{-1}A^{-1}$, ne $A^{-1}B^{-1}$, saj se mora $A$ v produktu $AB\,B^{-1}A^{-1}$ srečati s svojim inverzom.

## Povzetek

- Elementarne transformacije vrstic: zamenjava, množenje z $c \neq 0$, prištevanje večkratnika druge vrstice; vsaka je množenje z elementarno matriko z leve.
- Rang je največje število neodvisnih vrstic (enako stolpcev); transformacije ga ne spremenijo, zato ga preberemo iz stopničaste oblike. Velja $\operatorname{rang} A \le \min(m, n)$.
- Kvadratna $A$ reda $n$ je obrnljiva $\iff \operatorname{rang} A = n \iff \det A \neq 0 \iff A \sim I$.
- Gauss-Jordan: $[A \mid I] \sim [I \mid A^{-1}]$; ničelna vrstica na levi pomeni, da inverza ni.
- Preizkus inverza: $AA^{-1} = I$. Pri parametru razčleni primere, kjer bi pivot postal $0$.

## Za izpit

Znati moraš povedati:
- definicijo elementarnih transformacij in elementarne matrike ter zakaj je vsaka obrnljiva;
- definicijo ranga in izrek, da ga transformacije vrstic ne spremenijo, z dokazom;
- izrek o enakovrednih pogojih za obrnljivost kvadratne matrike;
- zakaj Gauss-Jordanova metoda da ravno $A^{-1}$ (zapis z elementarnimi matrikami);
- pravilo $(AB)^{-1} = B^{-1}A^{-1}$ in $\operatorname{rang} A \le \min(m, n)$.

### Naloga 1

Dana je matrika $A = \begin{pmatrix} 1 & 2 & 1 & 0 \\ 2 & 5 & 3 & 1 \\ 1 & 3 & a & 1 \\ 0 & 1 & 1 & a \end{pmatrix}$, $a \in \mathbb{R}$. (a) Določi rang v odvisnosti od $a$. (b) Pri $a = 3$ izračunaj zadnji stolpec matrike $A^{-1}$, ne da bi računal ves inverz.

**Rešitev:**

1. $V_2 \leftarrow V_2 - 2V_1$: $(0, 1, 1, 1)$. $V_3 \leftarrow V_3 - V_1$: $(0, 1, a - 1, 1)$. Četrta ostane $(0, 1, 1, a)$.
2. $V_3 \leftarrow V_3 - V_2$: $(0, 0, a - 2, 0)$. $V_4 \leftarrow V_4 - V_2$: $(0, 0, 0, a - 1)$.
3. Za $a \neq 1$ in $a \neq 2$ so štirje pivoti, rang je $4$.
4. Pri $a = 2$ je tretja vrstica ničelna, četrta $(0, 0, 0, 1)$; po zamenjavi sta dve vrstici nad njo in rang je $3$.
5. Pri $a = 1$ je četrta vrstica ničelna, tretja $(0, 0, -1, 0)$; rang je $3$.
6. (b) Zadnji stolpec $\vec{x}$ matrike $A^{-1}$ reši $A\vec{x} = \vec{e}_4 = (0, 0, 0, 1)$, ker je $AA^{-1} = I$ po stolpcih.
7. Iste transformacije na desni: prvi trije koraki ne spremenijo ničel, zadnja vrstica da $2x_4 = 1$ (pri $a = 3$ je $a - 1 = 2$), torej $x_4 = \frac{1}{2}$.
8. Tretja vrstica: $(a - 2)x_3 = 0$, torej $x_3 = 0$. Druga: $x_2 + x_3 + x_4 = 0$, torej $x_2 = -\frac{1}{2}$. Prva: $x_1 + 2x_2 + x_3 = 0$, torej $x_1 = 1$.
9. Preizkus z drugo vrstico $A$: $2 \cdot 1 + 5 \cdot (-\frac{1}{2}) + 3 \cdot 0 + 1 \cdot \frac{1}{2} = 0$. Drži.
10. Odgovor: rang je $4$ za $a \notin \{1, 2\}$ in $3$ za $a = 1$ ali $a = 2$; pri $a = 3$ je zadnji stolpec $A^{-1}$ enak $(1, -\frac{1}{2}, 0, \frac{1}{2})^T$.

### Naloga 2

Naj bo $A$ kvadratna matrika reda $n$ in naj zaporedje elementarnih transformacij vrstic spremeni $[A \mid I]$ v $[I \mid B]$. Dokaži, da je $AB = I$ in $BA = I$.

**Rešitev:**

1. Vsaka transformacija je množenje z leve z elementarno matriko, zato je $E_k \cdots E_1 [A \mid I] = [E_k \cdots E_1 A \mid E_k \cdots E_1]$.
2. Iz $[I \mid B]$ preberemo $E_k \cdots E_1 A = I$ in $B = E_k \cdots E_1$. Torej $BA = I$.
3. Vsaka $E_j$ je obrnljiva (njen inverz je elementarna matrika obratne transformacije), zato je obrnljiv tudi produkt $B$, z $B^{-1} = E_1^{-1} \cdots E_k^{-1}$.
4. Iz $BA = I$ z leve pomnožimo z $B^{-1}$: $A = B^{-1}$. Torej je $AB = B^{-1}B = I$.
5. Sklep: $B$ je obojestranski inverz, $B = A^{-1}$. Zato pri Gauss-Jordanu ni treba posebej preverjati, da je $AB = I$; preizkus lovi le računske napake.

## Drugače: Na sliki

Vrstice matrike $3 \times 3$ si predstavljaj kot tri puščice iz izhodišča v prostoru.

- Rang $3$: puščice napenjajo ves prostor, kot tri robovi škatle.
- Rang $2$: vse tri ležijo v isti ravnini, škatla je sploščena v list papirja. Tako je pri sošolčevi matriki: tretja puščica je diagonala paralelograma prvih dveh.
- Rang $1$: vse leže na isti premici, kot pri $a = 1$ v Primeru 3.

Elementarne transformacije puščice premikajo, raztezajo ali zamenjajo, ne da bi jih spravile iz njihove ravnine ali premice. Zato se rang ne spremeni. Inverz obstaja le za neploščato »škatlo«: ploščate ni mogoče spet napihniti, ker ne veš, v katero smer.

## Drugače: Uporaba v stroki

**Elektroenergetska omrežja.** Pri analizi pretokov moči sestavimo matriko admitanc vozlišč. Če nobeno vozlišče ni povezano z referenco (maso), so vsote vrstic enake nič in je rang $n - 1$. Matrike tedaj ni mogoče obrniti. Fizikalno to pomeni, da so potenciali določeni le do konstante natančno. Zato inženirji vedno izberejo eno vozlišče za referenco in ga izločijo.

**Opazljivost in vodljivost.** V teoriji vodenja (na primer pri regulaciji pretvornika v sončni elektrarni) sistem lahko pripeljemo v vsako stanje, če ima posebna matrika iz parametrov sistema poln rang. Inženir to preveri z rangom, ne z determinanto, ker matrika ni kvadratna.

**Numerika.** Programi, kot je Octave, inverza ne računajo s prirejenko. Uporabljajo eliminacijo z delnim pivotiranjem: za pivot izberejo največji element v stolpcu, da zaokrožitvene napake ne narastejo. Ukaz `A \ b` reši sistem brez računanja $A^{-1}$, kar je hitreje in natančneje.

## Drugače: Bolj natančno

**Izrek.** Vrstični rang matrike je enak stolpčnemu.

**Dokaz.** Naj bo vrstični rang $r$ in naj vrstice $\vec{w}_1, \ldots, \vec{w}_r$ tvorijo bazo vrstičnega prostora. Vsaka vrstica $A$ je njihova kombinacija, zato je $A = CW$, kjer ima $C$ dimenzije $m \times r$ in $W$ (vrstice $\vec{w}_i$) dimenzije $r \times n$. Vsak stolpec $A$ je torej kombinacija $r$ stolpcev matrike $C$. Stolpčni rang je zato največ $r$. Isti sklep za $A^T$ da obratno neenakost. $\blacksquare$

**Rang in sistemi.** Iz tega sledi izrek Kronecker-Capelli, ki ga srečaš pri sistemih linearnih enačb: sistem $A\vec{x} = \vec{b}$ je rešljiv natanko tedaj, ko je $\operatorname{rang} A = \operatorname{rang}[A \mid \vec{b}]$. Število prostih neznank je $n - \operatorname{rang} A$.

## Preveri se

? Katera trditev o matriki $A$ dimenzij $4 \times 6$ je pravilna?
- Rang je lahko $6$, ker ima matrika $6$ stolpcev.
~ Rang je tudi število neodvisnih vrstic, teh pa je največ $4$.
+ Rang je največ $4$.
- Rang je vedno $4$, ker so vrstice dolge.
~ Dolžina vrstic ne zagotavlja neodvisnosti; ničelna matrika $4 \times 6$ ima rang $0$.
- Ranga ni mogoče določiti, ker matrika ni kvadratna.
~ To velja za determinanto. Rang je definiran za vsako matriko.
> $\operatorname{rang} A \le \min(4, 6) = 4$.

? Koliko je rang matrike $\begin{pmatrix} 1 & 2 \\ 2 & 4 \\ 3 & 6 \end{pmatrix}$?
- $3$
~ Matrika ima le $2$ stolpca, zato rang ne more preseči $2$.
- $2$
~ Ni enakih vrstic, a vse so večkratniki prve: $V_2 = 2V_1$, $V_3 = 3V_1$.
+ $1$
- $0$
~ Rang $0$ ima le ničelna matrika.
> Po $V_2 \leftarrow V_2 - 2V_1$ in $V_3 \leftarrow V_3 - 3V_1$ ostane ena neničelna vrstica.

? Študent računa inverz $A = \begin{pmatrix} 1 & 2 \\ 3 & 7 \end{pmatrix}$. Naredi $V_2 \leftarrow V_2 - 3V_1$ in dobi $\left(\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 0 & 1 & 0 & 1 \end{array}\right)$. Kje je napaka?
- Transformacija ni dovoljena, ker odšteva večkratnik.
~ Prištevanje večkratnika druge vrstice je transformacija T3 in je dovoljena.
+ Desne strani ni preoblikoval: druga vrstica desno bi morala biti $(-3, 1)$.
- Na levi bi moral dobiti $(0, 0)$ v drugi vrstici.
~ $7 - 3 \cdot 2 = 1$, leva stran je prav.
> Transformacija velja za celo vrstico; pravilno je $(0, 1 \mid -3, 1)$, na koncu pa $A^{-1} = \begin{pmatrix} 7 & -2 \\ -3 & 1 \end{pmatrix}$.

? Primerjaj dve poti do inverza matrike reda $5$. Katera trditev je pravilna?
- Prirejenka je hitrejša, ker je formula ena sama.
~ Formula je kratka, računa pa je veliko: $25$ determinant reda $4$ in še $\det A$.
+ Gauss-Jordan potrebuje bistveno manj računanja, okoli $n^3$ operacij.
- Obe poti sta enako dolgi, ker dasta isti rezultat.
~ Rezultat je isti, delo pa ne; število operacij pri prirejenki raste veliko hitreje.
> Pri $n = 5$ je eliminacija okoli $125$ množenj, prirejenka pa zahteva $26$ determinant.

? Inženir sestavi matriko prevodnosti omrežja, v katerem nobeno vozlišče ni povezano z maso. Vsote vseh vrstic so $0$. Kaj lahko sklepa?
- Matrika je obrnljiva, ker so na diagonali pozitivna števila.
~ Pozitivna diagonala ne zadošča: vsota stolpcev je ničeln vektor, stolpci so odvisni.
- Vse napetosti vozlišč so enake nič.
~ Napetosti niso nič, temveč niso enolično določene.
+ Rang je manjši od $n$, inverza ni in potenciali so določeni le do konstante.
- Rang je $0$.
~ Matrika ni ničelna; njen rang je običajno $n - 1$.
> Ker je vsota stolpcev ničelna, je $\operatorname{rang} G < n$. Zato izberemo referenčno vozlišče in ga izločimo.

:::simboli
A | matrika
I | enotska matrika | | | diagonala enic
E | elementarna matrika | | | I po eni transformaciji
G | matrika prevodnosti vozlišč | | S
\vec{U}, \vec{U}_a, \vec{U}_b | napetosti vozlišč proti masi | \vec{U} = G^{-1}\vec{J} | V
\vec{J}, \vec{J}_a, \vec{J}_b | vbrizgani tokovi v vozlišča | | A
V_i, V_1, V_2, V_3 | vrstice matrike | | | pri transformacijah
c | neničelno število (faktor transformacije)
E_k, E_1 | elementarne matrike v zaporedju transformacij
:::
