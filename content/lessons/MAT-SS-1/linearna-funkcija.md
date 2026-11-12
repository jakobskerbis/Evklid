---
stanje: osnutek
demo: linearna
avtor: AI
---

## Zakaj se tega učimo

Mobilni paket stane $5\,\text{€}$ na mesec, vsak porabljeni gigabajt (GB) prenosa podatkov pa še $2\,\text{€}$. Koliko plačaš, če porabiš $3\,\text{GB}$? In pri $7\,\text{GB}$? Hitro izračunaš $11\,\text{€}$ in $19\,\text{€}$. Vsak dodatni GB doda enakih $2\,\text{€}$, zato cena raste enakomerno.

Ravno to enakomerno rast opiše linearna funkcija. Linearna funkcija je najpreprostejši način, kako opišemo enakomerno spreminjanje: cena glede na število kupljenih kosov, pot pri enakomerni hitrosti, strošek taksija glede na prevožene kilometre. Če poznaš formulo, lahko **napovedeš vrednost, ki je še nisi izmeril**, in ugotoviš, kdaj se zgodi nekaj pomembnega (npr. kdaj bo stanje na računu enako nič). Linearna funkcija je tudi temelj za enačbe, neenačbe in sisteme enačb, ki sledijo.

## Razlaga

**1. Definicija.** Linearna funkcija je funkcija oblike

$$f(x) = kx + n, \qquad \text{oziroma} \qquad y = kx + n,$$

kjer sta $k$ in $n$ realni števili. Spremenljivka $x$ je neodvisna (izbereš jo sam), $y$ pa odvisna spremenljivka (izračunaš jo). Cena paketa iz uvoda je $y = 2x + 5$: $x$ je število GB, $y$ cena v evrih.

*Hitri preizkus:* je $y = 3x^2 + 1$ linearna funkcija? (Ne, ker $x$ nastopa s kvadratom.)

**2. Pomen števil $k$ in $n$.**

- $k$ je **smerni koeficient**. Pove, za koliko se spremeni $y$, ko se $x$ poveča za $1$. V paketu je $k = 2$: vsak GB doda $2\,\text{€}$.
- $n$ je **začetna vrednost**. Pove, kolikšen je $y$ pri $x = 0$, torej kje graf seka os $y$: v točki $(0, n)$. V paketu je $n = 5$: toliko plačaš, tudi če ne porabiš nič.

*Hitri preizkus:* kolikšna sta $k$ in $n$ pri $y = 0{,}5x + 8$? ($k = 0{,}5$; $n = 8$.)

**3. Graf.** Graf linearne funkcije je **premica**. Za risanje zadostujeta dve točki. Najlažje vzameš točko $(0, n)$ in še eno, ki jo dobiš z vstavljanjem poljubnega $x$. Za paket sta to $(0, 5)$ in $(3, 11)$:

:::risba graf
opis: Graf funkcije y = 2x + 5 za x od 0 do 6. Premica gre skozi točki (0, 5) in (3, 11) in se konča pri (6, 17).
x: 0 .. 6 | 1 | x (GB)
y: 0 .. 18 | 2 | y (€)
f: 2*x + 5 | modra | 0 .. 6
točka: 0; 5 | (0, 5) | desno
točka: 3; 11 | (3, 11) | desno
:::

*Hitri preizkus:* katera točka grafa pove ceno pri $6\,\text{GB}$? (Točka $(6, 17)$, torej $17\,\text{€}$.)

**4. Smerni koeficient in lega premice.**

- $k > 0$: funkcija je **naraščajoča** (premica gre od leve proti desni navzgor).
- $k < 0$: funkcija je **padajoča** (premica gre navzdol).
- $k = 0$: funkcija je **konstantna** $y = n$, premica je vodoravna.
- Večja ko je $|k|$, strmejša je premica.

Na sliki je $k = 1$ in $n = 2$; v aplikaciji ju lahko spreminjaš z drsnikoma pod sliko. Črtkana stopnica kaže smerni koeficient: ko greš od točke $(0, n)$ za $1$ v desno, se premica dvigne za $k$ (pri negativnem $k$ se spusti).

:::risba graf
opis: Graf premice y = kx + n v koordinatnem sistemu od −6 do 6 na obeh oseh. V aplikaciji se z drsnikoma spreminjata smerni koeficient k od −3 do 3 in začetna vrednost n od −3 do 3. Izbrano je k = {k} in n = {n}: premica seka os y v točki (0, {n}), črtkana stopnica gre od te točke za 1 v desno in nato za k do premice.
x: -6 .. 6
y: -6 .. 6
enako: da
drsnik: k | -3 .. 3 | 0,5 | 1 | smerni koeficient k
drsnik: n | -3 .. 3 | 1 | 2 | začetna vrednost n
f: k*x + n
črta: 0; n -> 1; n -> 1; k + n | oranžna črtkano
točka: 0; n | (0, {n}) | levo | oranžna
podnapis: y = kx + n pri k = {k} in n = {n}
:::

V simulaciji spodaj (»Graf funkcije y = kx + n«) pusti $n = 5$ in pomikaj $k$ od $2$ do $-2$. Opazi, da se premica vrti okoli točke $(0, 5)$ in da je pri $k = 0$ vodoravna.

:::premisli
Drug operater ponuja paket $y = 3x + 2$. Kateri graf je strmejši in zakaj se premici nekje sekata?
---
Strmejši je $y = 3x + 2$, ker je $3 > 2$. Začne nižje ($2 < 5$), a raste hitreje, zato drugo premico na neki točki dohiti (pri $x = 3$ sta obe ceni $11\,\text{€}$).
:::

**5. Izračun smernega koeficienta iz dveh točk.** Če poznaš točki $A(x_1, y_1)$ in $B(x_2, y_2)$, kjer je $x_1 \ne x_2$, je

$$k = \frac{y_2 - y_1}{x_2 - x_1}.$$

Ulomek pove, koliko se $y$ spremeni na enoto spremembe $x$.

*Hitri preizkus:* kolikšen je $k$ skozi $(0, 5)$ in $(3, 11)$? ($k = \dfrac{6}{3} = 2$, kot pri paketu.)

**6. Ničla.** Ničla funkcije je vrednost $x$, pri kateri je $f(x) = 0$. Na grafu je to presečišče z osjo $x$, točka $(x_0, 0)$. Dobimo jo z reševanjem enačbe $kx + n = 0$:

$$x_0 = -\frac{n}{k}, \qquad k \ne 0.$$

Če je $k = 0$ in $n \ne 0$, ničle ni (premica je vzporedna osi $x$). Če je $k = 0$ in $n = 0$, je vsak $x$ ničla.

:::premisli
Baterija telefona ima $100\,\%$ in vsako uro izgubi $10\,\%$: $y = -10x + 100$. Kaj v tej zgodbi pomeni ničla in zakaj pri cenovnem paketu $y = 2x + 5$ za $x \ge 0$ ničle ni?
---
Ničla $x_0 = 10$ pomeni, da je telefon po $10$ urah prazen. Pri paketu cena samo raste od $5\,\text{€}$ naprej, zato pri $x \ge 0$ nikoli ni $0$ (ničla $-2{,}5$ nima smisla, število GB ne more biti negativno).
:::

## Rešeni primeri

### Primer 1 (lažji): graf in ničla

Nariši graf funkcije $f(x) = 2x - 4$ in izračunaj njeno ničlo.

**Podatki:** $f(x) = 2x - 4$
**Iščemo:** dve točki grafa in ničlo $x_0$

:::formula
$f(x) = kx + n$, presečišče z osjo $y$ je $(0, n)$; ničla: $f(x_0) = 0$
:::

**Rešitev:**

1. Preberemo: $k = 2$, $n = -4$. Ker je $k > 0$, funkcija narašča.
2. Prva točka je presečišče z osjo $y$: $(0, -4)$. Zakaj: pri $x = 0$ je $f(0) = n$.
3. Druga točka: izberemo $x = 3$, $f(3) = 2 \cdot 3 - 4 = 2$, torej $(3, 2)$.
4. Skozi točki $(0,-4)$ in $(3,2)$ potegnemo premico.
5. Ničla: $2x - 4 = 0$, torej $2x = 4$ in $x_0 = 2$. Zakaj: ničla je $x$, pri katerem je $y = 0$.
6. Preverimo: $f(2) = 2 \cdot 2 - 4 = 0$. ✓ Točka $(2, 0)$ leži na premici med izbranima točkama, kar je smiselno.
7. Odgovor: premica gre skozi $(0, -4)$ in $(3, 2)$, ničla funkcije je $x_0 = 2$.

### Primer 2: funkcija iz dveh točk

Premica poteka skozi točki $A(1, 5)$ in $B(4, -1)$. Zapiši enačbo funkcije.

**Podatki:** $A(1, 5)$, $B(4, -1)$
**Iščemo:** enačbo $y = kx + n$ in ničlo $x_0$

:::formula
$k = \dfrac{y_2 - y_1}{x_2 - x_1}$, nato $n$ iz $y_1 = k x_1 + n$
:::

**Rešitev:**

1. Smerni koeficient: $k = \dfrac{-1 - 5}{4 - 1} = \dfrac{-6}{3} = -2$. Zakaj: ulomek pove spremembo $y$ na enoto $x$. Ker je $k < 0$, funkcija pada, kar se ujema s tem, da $y$ od $5$ pade na $-1$.
2. Zapišemo $y = -2x + n$ in vstavimo točko $A$: $5 = -2 \cdot 1 + n$.
3. Rešimo: $n = 5 + 2 = 7$.
4. Enačba: $y = -2x + 7$.
5. Preverimo z drugo točko: $-2 \cdot 4 + 7 = -8 + 7 = -1$. ✓
6. Ničla: $-2x + 7 = 0$, $x_0 = \dfrac{7}{2} = 3{,}5$. Zakaj: na osi $x$ je $y = 0$.
7. Odgovor: funkcija je $y = -2x + 7$, njena ničla je $x_0 = 3{,}5$.

### Primer 3 (težji): besedilna naloga, zadnji korak naredi sam

Operater za tablico zaračuna mesečno naročnino $3\,\text{€}$ in $1{,}20\,\text{€}$ za vsak porabljen GB. (a) Zapiši funkcijo cene. (b) Kolikšen je račun pri $15\,\text{GB}$? (c) Koliko GB smo porabili, če je račun $27\,\text{€}$?

**Podatki:** naročnina $3\,\text{€}$, cena enega GB $1{,}20\,\text{€}$, poraba $15\,\text{GB}$, račun $27\,\text{€}$
**Iščemo:** funkcijo cene, račun pri $15\,\text{GB}$ in porabo pri računu $27\,\text{€}$

:::formula
$y = kx + n$: $k$ je cena enega GB, $n$ je naročnina
:::

**Rešitev:**

1. **Spremenljivki.** Naj bo $x$ število porabljenih GB in $y$ račun v evrih.
2. **(a)** Pri $x = 0$ plačamo $3$, zato je $n = 3$. Vsak GB doda $1{,}20$, zato je $k = 1{,}2$. Funkcija: $y = 1{,}2x + 3$.
3. **(b)** Vstavimo $x = 15$: $y = 1{,}2 \cdot 15 + 3 = 18 + 3 = 21$. Račun je $21\,\text{€}$.
4. **(c)** Tu je znan $y$, iščemo $x$, zato zapišemo enačbo $1{,}2x + 3 = 27$. Reši jo sam in preveri z vstavljanjem.

:::premisli
Koliko GB smo porabili pri računu $27\,\text{€}$?
---
Odštejemo $3$: $1{,}2x = 24$. Delimo z $1{,}2$: $x = 20$. Preizkus: $1{,}2 \cdot 20 + 3 = 27$. Porabili smo $20\,\text{GB}$; pri $15\,\text{GB}$ pa je račun $21\,\text{€}$.
:::

## Pogoste napake

- **Zamenjava $k$ in $n$.** »Pri $y = -4x + 1$ je prvo število začetna vrednost, torej $(0, -4)$.« Napačno: $k$ je število ob $x$ (naklon), $n$ je prosti člen. Popravek: najprej podčrtaj člen z $x$; pri $y = -4x + 1$ je $k = -4$, $n = 1$.
- **Napačen predznak ničle.** »Iz $3x - 12 = 0$ je $x = -4$, ker je v enačbi minus.« Napačno: $-12$ preneseš na desno kot $+12$, zato $3x = 12$ in $x = 4$. Popravek: ničlo izračunaj z reševanjem enačbe in jo preveri z vstavljanjem.
- **Obrnjen ulomek za $k$.** »$k = \dfrac{x_2 - x_1}{y_2 - y_1}$.« Napačno: $k$ pove spremembo $y$ na enoto $x$, zato je razlika $y$ v števcu. Popravek: $k = \dfrac{y_2 - y_1}{x_2 - x_1}$, obe razliki odštej v istem vrstnem redu.
- **Ničla kot točka $(0, n)$.** »Ničla od $3x - 12$ je $-12$, ker je tam premica na osi.« Napačno: $(0, n)$ leži na osi $y$, ničla pa na osi $x$, kjer je $y = 0$. Popravek: vedno postavi $f(x) = 0$.
- **Pri padajoči funkciji $k$ brez minusa.** »Ničla je $3$ in $n = 6$, torej $k = \dfrac{6}{3} = 2$.« Napačno: če $y$ z večanjem $x$ pada (od $6$ pri $x = 0$ do $0$ pri $x = 3$), je $k$ negativen. Popravek: računaj z obrazcem iz točk $(0, 6)$ in $(3, 0)$, ki da $k = -2$.

## Povzetek

- Linearna funkcija: $f(x) = kx + n$, graf je premica.
- $k$ je smerni koeficient: $k > 0$ narašča, $k < 0$ pada, $k = 0$ je konstantna funkcija.
- $n$ je začetna vrednost: premica seka os $y$ v točki $(0, n)$.
- Iz dveh točk: $k = \dfrac{y_2 - y_1}{x_2 - x_1}$, nato $n$ dobimo z vstavitvijo ene točke.
- Ničla: $x_0 = -\dfrac{n}{k}$ (za $k \ne 0$), presečišče z osjo $x$.
- Vedno preveri z vstavljanjem v funkcijo.

## Drugače: Na sliki

V demonstraciji »Graf funkcije $y = kx + n$« zgoraj spreminjaj drsnika za $k$ in $n$ ter opazuj premico.

- Ko spreminjaš **$n$**, se premica premika gor in dol, njen naklon pa ostane enak. Vedno gre skozi točko $(0, n)$ na osi $y$.
- Ko spreminjaš **$k$**, se premica vrti okoli točke $(0, n)$. Pri pozitivnem $k$ gre navzgor, pri negativnem navzdol, pri $k = 0$ je vodoravna.
- Poišči točko, kjer premica seka os $x$. Njena prva koordinata je ničla. Opazuj, da se ničla premakne, ko spremeniš $k$ ali $n$.

Smerni koeficient lahko na sliki vidiš kot »stopnico«: ko greš za $1$ v desno, se premica dvigne (ali spusti) za $k$. Pri $k = 2$ greš $1$ desno in $2$ gor, pri $k = -\tfrac{1}{2}$ greš $2$ desno in $1$ dol.

Simulacija spodaj (»Graf funkcije y = kx + n«) ti omogoča, da premice raziskuješ še naprej: spreminjaš naklon in začetno vrednost ter opazuješ, kako se spremeni enačba.

## Drugače: Iz vsakdanjega življenja

Predstavljaj si, da imaš na prepaidni kartici $10\,\text{€}$ in vsak dan porabiš $2\,\text{€}$. Stanje po $x$ dneh je

$$y = -2x + 10.$$

- $n = 10$: začetno stanje.
- $k = -2$: stanje pada za $2\,\text{€}$ na dan.
- Ničla: $-2x + 10 = 0$, torej $x = 5$. Čez $5$ dni bo kartica prazna.

Podobno je pri hoji z enakomerno hitrostjo: če začneš $100\,\text{m}$ od doma in hodiš stran s hitrostjo $1{,}5\,\text{m/s}$, je razdalja $y = 1{,}5x + 100$ (v metrih, $x$ v sekundah). Hitrost je smerni koeficient.

Vsakič, ko se nekaj spreminja **za enako količino na enoto**, je to linearna funkcija. Če se spreminja vedno hitreje ali počasneje, ni linearna.

## Drugače: Korak za korakom s številkami

Recept za risanje grafa in iskanje ničle pri $f(x) = -\tfrac{1}{2}x + 3$.

1. Preberi $k = -\tfrac{1}{2}$ in $n = 3$.
2. Tabela vrednosti:

| $x$ | $-2$ | $0$ | $2$ | $6$ |
|---|---|---|---|---|
| $y = -\tfrac{1}{2}x + 3$ | $4$ | $3$ | $2$ | $0$ |

3. Preveri izračune: $-\tfrac{1}{2}\cdot(-2) + 3 = 1 + 3 = 4$; $-\tfrac{1}{2}\cdot 2 + 3 = -1 + 3 = 2$; $-\tfrac{1}{2}\cdot 6 + 3 = -3 + 3 = 0$.
4. Opaziš: ko se $x$ poveča za $2$, se $y$ zmanjša za $1$. Razmerje je $\dfrac{-1}{2} = -\dfrac{1}{2} = k$. Vrednosti v tabeli so torej skladne s smernim koeficientom.
5. Ničla: $-\tfrac{1}{2}x + 3 = 0$, $x = 6$. Res, v tabeli je $y = 0$ pri $x = 6$.
6. Točke nariši v koordinatni sistem in jih poveži s premico.

## Drugače: Bolj natančno

**Zakaj je graf premica in zakaj $k$ ne zavisi od izbire točk?**

Vzemimo dve poljubni točki na grafu: $A(x_1, kx_1 + n)$ in $B(x_2, kx_2 + n)$. Izračunajmo količnik sprememb:

$$\frac{y_2 - y_1}{x_2 - x_1} = \frac{(kx_2 + n) - (kx_1 + n)}{x_2 - x_1} = \frac{k(x_2 - x_1)}{x_2 - x_1} = k.$$

Razmerje je za **vsak** par točk enako $k$. To je prav lastnost premice: konstanten naklon. Zato lahko $k$ izračunamo iz katerih koli dveh točk.

**Ničla.** Iz $kx + n = 0$ dobimo $kx = -n$. Če je $k \neq 0$, lahko delimo s $k$ in dobimo $x_0 = -\dfrac{n}{k}$. Če je $k = 0$, enačba postane $n = 0$, ki je ali vedno resnična (če je $n = 0$) ali nikoli (če je $n \ne 0$). Zato konstantna funkcija nima ene same ničle.

## Preveri se

? Katera je ničla funkcije $f(x) = 3x - 12$?
- $x = -4$
~ Napačen predznak: $-12$ na desni postane $+12$, zato $3x = 12$ in $x = 4$.
+ $x = 4$
- $x = -12$
~ To je $n$, presečišče z osjo $y$, ne ničla. Ničla je pri $f(x) = 0$.
- $x = 12$
~ Pozabil si deliti s $3$: iz $3x = 12$ sledi $x = 4$.
> Rešimo $3x - 12 = 0$, torej $3x = 12$ in $x = 4$. Vrednost $-12$ je presečišče z osjo $y$ ($f(0) = -12$), ne ničla.

? Premica poteka skozi točki $(2, 1)$ in $(5, 7)$. Kolikšen je smerni koeficient?
- $k = \dfrac{1}{2}$
~ Obrnjen ulomek: razlika $x$ ne sodi v števec. $k = \dfrac{y_2 - y_1}{x_2 - x_1}$.
- $k = 3$
~ To je samo razlika $x$ ($5 - 2$). Spremembo $y$ moraš deliti z njo.
+ $k = 2$
- $k = -2$
~ Razliki si odštel v različnem vrstnem redu. Ko $x$ raste, raste tudi $y$, zato je $k > 0$.
> $k = \dfrac{7 - 1}{5 - 2} = \dfrac{6}{3} = 2$. Odgovor $\dfrac12$ je obrnjen ulomek, $-2$ pa bi veljal za padajočo funkcijo.

? Katera tabela vrednosti pri $x = 0$; $1$; $2$ sodi k funkciji $y = -4x + 1$?
- $y$: $-4$; $-3$; $-2$
~ Zamenjal si $k$ in $n$: to je tabela za $y = x - 4$. Začetna vrednost je $n = 1$.
- $y$: $1$; $5$; $9$
~ Izpustil si minus pri $k$: to je $y = 4x + 1$, ki narašča.
+ $y$: $1$; $-3$; $-7$
> Pri $x = 0$ je $y = n = 1$, nato se $y$ ob vsakem koraku za $1$ zmanjša za $4$, ker je $k = -4$. Funkcija pada in seka os $y$ v $(0, 1)$.

? Telefon ima $100\,\%$ baterije in porabi $7\,\%$ na uro. Približno čez koliko ur bo prazen?
- približno $7$ ur
~ $7$ je smerni koeficient (poraba na uro), ne čas. Iščeš ničlo funkcije $y = -7x + 100$.
+ približno $14$ ur
- približno $100$ ur
~ $100$ je začetna vrednost $n$, ne ničla. Ničla je tam, kjer je $y = 0$.
- približno $-14$ ur
~ Napačen predznak: $x_0 = -\dfrac{n}{k} = -\dfrac{100}{-7}$, kar je pozitivno.
> Ničla funkcije $y = -7x + 100$: $x_0 = \dfrac{100}{7} \approx 14{,}3$. Po približno $14$ urah je baterija prazna.

? Premica ima ničlo $x_0 = 3$ in seka os $y$ v $(0, 6)$. Nik trdi, da je $k = 2$. Zakaj nima prav?
- Ker je $k = \dfrac{1}{2}$: razlika $x$ je $3$, razlika $y$ je $6$.
~ Obrnjen ulomek in še brez predznaka. V števcu je razlika $y$.
+ Ker $y$ od $6$ pade na $0$, ko $x$ zraste od $0$ do $3$, zato je $k = \dfrac{0 - 6}{3 - 0} = -2$.
- Ker je $k$ vedno enak ničli funkcije, torej $k = 3$.
~ Ničla je presečišče z osjo $x$, ne naklon. Naklon izračunaš iz dveh točk.
> Točki $(0, 6)$ in $(3, 0)$ dasta $k = \dfrac{0 - 6}{3 - 0} = -2$. Premica pada, zato $k$ ne more biti pozitiven; Nik je pozabil predznak.

:::simboli
f | linearna funkcija | f(x) = kx + n | |
x | neodvisna spremenljivka | | |
y | odvisna spremenljivka (vrednost funkcije) | y = kx + n | |
k | smerni koeficient | k = \frac{y_2 - y_1}{x_2 - x_1} | | za koliko se y spremeni, ko se x poveča za 1
n | začetna vrednost (presečišče z osjo y) | | |
x_1, x_2 | abscisi dveh točk grafa | | | x₁ ≠ x₂
y_1, y_2 | ordinati dveh točk grafa | | |
x_0 | ničla funkcije | x_0 = -\frac{n}{k} | | k ≠ 0; graf seka os x v (x₀, 0)
:::
