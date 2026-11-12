---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Odpri na telefonu aplikacijo, ki snema zvok, in zažvižgaj. Na zaslonu se izriše val. Ko žvižgaš glasneje, je val višji. Ko žvižgaš višji ton, je val gostejši: v enakem času je valov več.

**Napoved.** Graf $y = \sin x$ je tak val. Eden od zapisov $y = 2\sin x$ in $y = \sin 2x$ opiše glasnejši žvižg, drugi višji ton. Kateri je kateri? Zapiši si odgovor; v 5. razdelku ga preveriš.

Iz prejšnje lekcije veš, da se vrednosti sinusa in kosinusa ponovijo po vsakem polnem obratu. Ko znaš njun val raztegniti, skrčiti in premakniti, z eno formulo opišeš zvok, utripanje lučke na telefonu ali nihanje vzmeti.

## Razlaga

**1. Od krožnice do grafa.** Točka $T$ kroži po enotski krožnici. Njena navpična koordinata je $\sin x$, kjer je $x$ kot v radianih. Na vodoravno os nanašamo kot $x$, na navpično pa višino točke. Nekaj vrednosti:

| $x$ | $\sin x$ | $\cos x$ |
|---|---|---|
| $0$ | $0$ | $1$ |
| $\frac{\pi}{2}$ | $1$ | $0$ |
| $\pi$ | $0$ | $-1$ |
| $\frac{3\pi}{2}$ | $-1$ | $0$ |
| $2\pi$ | $0$ | $1$ |

Točke povežemo z gladko krivuljo. Dobimo **sinusoido**: val, ki se dvigne do $1$, pade do $-1$ in se vrne na $0$.

V simulaciji spodaj (»Od enotske krožnice do grafa«) počasi povečuj kot od $0$ do $2\pi$. Opazuj, kako višina točke na krožnici sproti riše graf. Pri katerem kotu je graf najvišje?

*Preveri:* pri katerem $x$ med $0$ in $2\pi$ je $\sin x$ najmanjši? *Odgovor:* pri $\frac{3\pi}{2}$, kjer je $\sin x = -1$.

**2. Perioda.** Funkcija je **periodična**, če se njene vrednosti ponavljajo: obstaja število $T > 0$, da je $f(x + T) = f(x)$ za vsak $x$. Najmanjše tako število je **osnovna perioda**. Za sinus in kosinus je osnovna perioda $2\pi$, ker je to en poln obrat.

*Preveri:* ali je $4\pi$ tudi perioda sinusa? *Odgovor:* je, ker sta to dva obrata, a ni osnovna perioda.

**3. Lastnosti osnovnih grafov.**

| | $\sin x$ | $\cos x$ |
|---|---|---|
| zaloga vrednosti | $[-1, 1]$ | $[-1, 1]$ |
| ničle | $k\pi$ | $\frac{\pi}{2} + k\pi$ |
| maksimum $1$ pri | $\frac{\pi}{2} + 2k\pi$ | $2k\pi$ |

Tu je $k$ poljubno celo število. Graf kosinusa ima enako obliko kot graf sinusa, le premaknjen je za $\frac{\pi}{2}$ v levo: vrh ima pri $0$, sinus pa šele pri $\frac{\pi}{2}$.

Graf **tangensa** je drugačen. Tangens ni definiran tam, kjer je $\cos x = 0$, torej pri $x = \frac{\pi}{2} + k\pi$. Tam ima graf **navpične asimptote**: premice, ki se jim graf vse bolj približuje, a jih ne doseže. Zaloga vrednosti tangensa so vsa realna števila, osnovna perioda pa je $\pi$.

:::premisli
Ali je $\sin 4$ pozitiven ali negativen? Pomagaj si z grafom, ne s kalkulatorjem.
---
Negativen. Velja $\pi \approx 3{,}14 < 4 < \frac{3\pi}{2} \approx 4{,}71$, na tem delu pa je graf sinusa pod osjo $x$ (padajoč proti $-1$).
:::

**4. Amplituda: število pred sinusom.** Graf $y = 2\sin x$ dobiš tako, da vsako vrednost sinusa podvojiš. Val sega od $-2$ do $2$, ničle ostanejo na mestu. **Amplituda** je razdalja od srednje črte vala do vrha. Srednja črta je vodoravna premica, okoli katere val niha; pri $y = 2\sin x$ je to kar os $x$. Pri $y = A\sin x$ je amplituda $|A|$. Če je $A < 0$, se graf še zrcali čez os $x$.

*Preveri:* kolikšna je amplituda $y = -3\sin x$? *Odgovor:* $3$; graf je še zrcaljen čez os $x$.

**5. Perioda: število ob $x$.** Pri $y = \sin 2x$ se kot $2x$ spreminja dvakrat hitreje kot $x$. Val se zato ponovi dvakrat pogosteje, njegova višina pa ostane enaka. Pri $y = \sin(bx)$ je osnovna perioda

$$T = \frac{2\pi}{|b|}$$

Zdaj lahko preveriš napoved: $y = 2\sin x$ je višji val, torej glasnejši žvižg. $y = \sin 2x$ je gostejši val, torej višji ton.

:::premisli
Sošolec sklepa: »Pri $\sin 2x$ je kot dvakrat večji, zato je val dvakrat širši in perioda je $4\pi$.« Zakaj ima $\sin 2x$ v resnici periodo $\pi$?
---
Ker kot $2x$ teče dvakrat hitreje kot $x$. Ko $x$ naraste za $\pi$, naraste $2x$ že za $2\pi$, kar je cel obrat. Graf se zato v smeri osi $x$ skrči na polovico: $T = \frac{2\pi}{2} = \pi$.
:::

*Preveri:* kolikšna je osnovna perioda $y = \sin\frac{x}{3}$? *Odgovor:* $6\pi$, graf je raztegnjen.

**6. Premik v smeri osi $x$.** Pri $y = \sin(x - c)$ se graf premakne **v desno** za $c$, če je $c > 0$. Razlog: vrednost, ki jo je $\sin$ imel pri $0$, ima nova funkcija šele pri $x = c$, saj je $\sin(c - c) = \sin 0$. Če je $c < 0$, gre graf v levo.

*Preveri:* kam je premaknjen $y = \sin(x + 1)$? *Odgovor:* za $1$ v levo, ker je $x + 1 = x - (-1)$.

**7. Premik v smeri osi $y$.** Pri $y = \sin x + d$ se ves graf dvigne za $d$, pri $d < 0$ pa spusti. Vodoravna premica $y = d$ je **srednja črta**: val niha okoli nje.

*Preveri:* med katerima vrednostma niha $y = \sin x + 3$? *Odgovor:* med $2$ in $4$.

**8. Vse skupaj.** Vse štiri spremembe združi **splošna sinusna funkcija**:

$$f(x) = A\sin\big(b(x - c)\big) + d$$

| | kaj naredi | pravilo |
|---|---|---|
| $A$ | raztegne navpično | amplituda $\lvert A\rvert$ |
| $b$ | skrči ali raztegne vodoravno | $T = \frac{2\pi}{\lvert b\rvert}$ |
| $c$ | premakne vodoravno | za $c$ (pri $c > 0$ desno) |
| $d$ | premakne navpično | srednja črta $y = d$ |

Največja vrednost funkcije je $d + |A|$, najmanjša $d - |A|$. Če je $A < 0$, se graf zrcali čez srednjo črto.

V simulaciji spodaj (»Graf A sin(b(x − c)) + d«) nastavi $A = 1$, $b = 1$, $c = 0$, $d = 0$. Nato spremeni $b$ na $2$. Preštej, koliko celih valov je zdaj med $0$ in $2\pi$. Potem nastavi $c = 1$ in opazi, v katero smer se val premakne.

**Pazi na obliko.** Če je funkcija zapisana kot $\sin(2x - \frac{\pi}{2})$, najprej izpostavi $b$: $2x - \frac{\pi}{2} = 2\left(x - \frac{\pi}{4}\right)$. Premik je $c = \frac{\pi}{4}$, ne $\frac{\pi}{2}$.

Enako velja za kosinus: $f(x) = A\cos\big(b(x - c)\big) + d$ ima amplitudo $|A|$, periodo $\frac{2\pi}{|b|}$ in enaka premika.

## Rešeni primeri

### Primer 1 (lažji)

Dana je funkcija $f(x) = 3\sin x - 1$. Določi amplitudo, osnovno periodo in zalogo vrednosti. Kje na intervalu $[0, 2\pi]$ doseže največjo vrednost?

**Podatki:** $f(x) = 3\sin x - 1$, interval $[0, 2\pi]$
**Iščemo:** amplitudo, periodo $T$, zalogo vrednosti $Z_f$, mesto maksimuma

:::formula
$f(x) = A\sin\big(b(x - c)\big) + d$: amplituda $|A|$, $T = \dfrac{2\pi}{|b|}$, $Z_f = [d - |A|,\ d + |A|]$
:::

**Rešitev:**

1. Primerjamo s splošno obliko: $A = 3$, $b = 1$, $c = 0$, $d = -1$.
2. Amplituda je $|A| = 3$, ker je val trikrat višji od osnovnega.
3. $T = \frac{2\pi}{1} = 2\pi$, ker $b$ grafa ne skrči.
4. $Z_f = [-1 - 3,\ -1 + 3] = [-4, 2]$, ker je srednja črta pri $y = -1$.
5. $\sin x$ je največji pri $x = \frac{\pi}{2}$, zato tam tudi $f$: $f\left(\frac{\pi}{2}\right) = 3 \cdot 1 - 1 = 2$.
6. Odgovor: amplituda je $3$, perioda $2\pi$, $Z_f = [-4, 2]$; največjo vrednost $2$ doseže pri $x = \frac{\pi}{2}$.

### Primer 2 (srednji)

Za funkcijo $f(x) = 2\sin\left(2x - \frac{\pi}{2}\right) + 1$ določi amplitudo, osnovno periodo, premika in zalogo vrednosti. Pri katerem najmanjšem pozitivnem $x$ ima maksimum?

**Podatki:** $f(x) = 2\sin\left(2x - \frac{\pi}{2}\right) + 1$
**Iščemo:** amplitudo, $T$, premik v smeri osi $x$ in $y$, $Z_f$, prvi maksimum

:::formula
$f(x) = A\sin\big(b(x - c)\big) + d$, $\quad T = \dfrac{2\pi}{|b|}$; $\sin u = 1$ pri $u = \dfrac{\pi}{2} + 2k\pi$
:::

**Rešitev:**

1. Izpostavimo $2$: $2x - \frac{\pi}{2} = 2\left(x - \frac{\pi}{4}\right)$, da dobimo splošno obliko.
2. Preberemo $A = 2$, $b = 2$, $c = \frac{\pi}{4}$, $d = 1$.
3. Amplituda je $2$; perioda $T = \frac{2\pi}{2} = \pi$.
4. Graf je premaknjen za $\frac{\pi}{4}$ v desno in za $1$ navzgor.
5. $Z_f = [1 - 2,\ 1 + 2] = [-1, 3]$.
6. Maksimum je tam, kjer je $\sin$ enak $1$: $2\left(x - \frac{\pi}{4}\right) = \frac{\pi}{2}$, torej $x - \frac{\pi}{4} = \frac{\pi}{4}$ in $x = \frac{\pi}{2}$.
7. Preverimo: $f\left(\frac{\pi}{2}\right) = 2\sin\frac{\pi}{2} + 1 = 3$, kar je res zgornja meja $Z_f$.
8. Odgovor: amplituda $2$, perioda $\pi$, premik $\frac{\pi}{4}$ desno in $1$ gor, $Z_f = [-1, 3]$; prvi maksimum je pri $x = \frac{\pi}{2}$.

### Primer 3 (težji)

Aplikacija za dihalne vaje na telefonu kaže krog, ki se počasi veča in manjša. Njegov polmer niha med $10\,\text{mm}$ in $30\,\text{mm}$, en vdih in izdih skupaj trajata $8\,\text{s}$. Ob $t = 0$ ima krog srednji polmer in se veča. Zapiši polmer v obliki $r(t) = A\sin(bt) + d$ in izračunaj polmer po $1\,\text{s}$ in po $6\,\text{s}$.

**Podatki:** $r_{\min} = 10\,\text{mm}$, $r_{\max} = 30\,\text{mm}$, $T = 8\,\text{s}$, ob $t = 0$ srednji polmer in večanje
**Iščemo:** $A$, $b$, $d$ ter $r(1\,\text{s})$ in $r(6\,\text{s})$

:::formula
$A = \dfrac{r_{\max} - r_{\min}}{2}$, $\quad d = \dfrac{r_{\max} + r_{\min}}{2}$, $\quad b = \dfrac{2\pi}{T}$
:::

**Rešitev:**

1. Srednja črta je na sredini med skrajnima vrednostma: $d = \frac{30 + 10}{2} = 20\,\text{mm}$.
2. Amplituda je polovica razlike: $A = \frac{30 - 10}{2} = 10\,\text{mm}$.
3. Iz periode: $b = \frac{2\pi}{8} = \frac{\pi}{4}$ (na sekundo).
4. Premika $c$ ne potrebujemo: $\sin$ je pri $0$ na srednji črti in narašča, tako kot polmer kroga.
5. Torej $r(t) = 10\sin\left(\frac{\pi}{4}t\right) + 20$.
6. Po $1\,\text{s}$: $r(1) = 10\sin\frac{\pi}{4} + 20 = 10 \cdot \frac{\sqrt2}{2} + 20 = 5\sqrt2 + 20 \approx 27{,}1$, ker je $\frac{\pi}{4} = 45^\circ$.
7. Po $6\,\text{s}$: $r(6) = 10\sin\frac{3\pi}{2} + 20 = -10 + 20 = 10$. Minile so tri četrtine periode, krog je najmanjši.
8. Odgovor: $r(t) = 10\sin\left(\frac{\pi}{4}t\right) + 20$ (v milimetrih, $t$ v sekundah); po $1\,\text{s}$ je polmer približno $27{,}1\,\text{mm}$, po $6\,\text{s}$ pa $10\,\text{mm}$.

### Primer 4: zdaj ti

Graf funkcije $f(x) = A\sin(bx) + d$ ima največjo vrednost $5$, najmanjšo $-1$ in osnovno periodo $4\pi$. Velja $A > 0$ in $b > 0$. Določi $A$, $b$ in $d$.

**Podatki:** $f_{\max} = 5$, $f_{\min} = -1$, $T = 4\pi$, $A > 0$, $b > 0$
**Iščemo:** $A$, $b$, $d$

:::formula
$A = \dfrac{f_{\max} - f_{\min}}{2}$, $\quad d = \dfrac{f_{\max} + f_{\min}}{2}$, $\quad b = \dfrac{2\pi}{T}$
:::

**Rešitev:**

1. $A = \frac{5 - (-1)}{2} = 3$, ker je amplituda polovica razdalje med vrhom in dnom.
2. $d = \frac{5 + (-1)}{2} = 2$, ker je srednja črta na sredini.
3. Izračunaj še $b$ in zapiši funkcijo:

:::premisli
Koliko je $b$ in kako se glasi $f(x)$?
---
$b = \frac{2\pi}{4\pi} = \frac12$, torej $f(x) = 3\sin\frac{x}{2} + 2$. Perioda je daljša od $2\pi$, zato je $b < 1$: graf je raztegnjen.
:::

## Pogoste napake

- **Perioda pomnožena namesto deljena.** »Pri $\sin 2x$ je perioda $2 \cdot 2\pi = 4\pi$.« Večji $b$ pomeni hitrejše ponavljanje, torej krajšo periodo. Pravilno: $T = \frac{2\pi}{|b|}$, pri $\sin 2x$ je $T = \pi$.
- **Zamenjani vlogi števil.** »$y = \sin 2x$ je dvakrat višji val.« Število ob $x$ v oklepaju spremeni periodo, višino pa le število pred sinusom. Dvojke iz oklepaja tudi ne smeš prestaviti pred sinus: $\sin\left(2 \cdot \frac{\pi}{2}\right) = \sin\pi = 0$, a $2\sin\frac{\pi}{2} = 2$.
- **Napačna smer premika.** »$\sin\left(x - \frac{\pi}{3}\right)$ je premaknjen v levo, ker je tam minus.« Vrednost, ki jo ima $\sin$ pri $0$, ima nova funkcija pri $x = \frac{\pi}{3}$, torej desno. Minus v oklepaju pomeni premik v desno.
- **Premik brez izpostavljanja.** »Pri $\sin\left(2x - \frac{\pi}{3}\right)$ je premik $\frac{\pi}{3}$.« Najprej izpostavi $b$: $2\left(x - \frac{\pi}{6}\right)$. Premik je $\frac{\pi}{6}$.
- **Srednja črta prezrta.** »Pri $3\sin x - 1$ je amplituda $2$, ker je največja vrednost $2$.« ali »$Z_f$ funkcije $4\cos x + 1$ je $[-4, 4]$.« Amplitudo merimo od srednje črte $y = d$, ne od osi $x$, in ves val se premakne z njo. Pri $3\sin x - 1$ je amplituda $3$, pri $4\cos x + 1$ pa $Z_f = [-3, 5]$.

## Povzetek

- Sinus in kosinus imata osnovno periodo $2\pi$ in zalogo vrednosti $[-1, 1]$; tangens ima periodo $\pi$ in asimptote pri $x = \frac{\pi}{2} + k\pi$.
- Ničle: $\sin x = 0$ pri $x = k\pi$, $\cos x = 0$ pri $x = \frac{\pi}{2} + k\pi$.
- $f(x) = A\sin\big(b(x - c)\big) + d$: amplituda $|A|$, perioda $T = \dfrac{2\pi}{|b|}$.
- $c > 0$: premik v desno za $c$; $d > 0$: premik navzgor za $d$.
- Zaloga vrednosti: $[d - |A|,\ d + |A|]$.
- Pred branjem premika izpostavi $b$: $\sin(bx - p) = \sin\big(b(x - \frac{p}{b})\big)$.

## Drugače: Na sliki

Graf sinusa si predstavljaj kot val, ki ga narišeš s petimi točkami na eno periodo: **ničla, vrh, ničla, dno, ničla**. Razdalja med zaporednima točkama je vedno četrtina periode.

Zdaj si nariši vodoravno črtkano črto, **srednjo črto**. Val niha okoli nje: vrh je $|A|$ nad njo, dno $|A|$ pod njo.

- Če spremeniš $d$, premakneš srednjo črto gor ali dol, val gre z njo.
- Če spremeniš $A$, se val raztegne ali stisne v višino.
- Če spremeniš $b$, se pet točk stisne skupaj ali razmakne.
- Če spremeniš $c$, se cel val zdrsne levo ali desno.

Kosinus je isti val, le da se začne na vrhu: **vrh, ničla, dno, ničla, vrh**. Tangens nima vrhov: med dvema navpičnima asimptotama raste od zelo negativnih do zelo pozitivnih vrednosti.

## Drugače: Korak za korakom s številkami

Narišimo $f(x) = 2\sin\big(2(x - \frac{\pi}{4})\big) + 1$ iz Primera 2 s tabelo.

1. Perioda je $\pi$, četrtina periode je $\frac{\pi}{4}$.
2. Val se začne pri $x = c = \frac{\pi}{4}$, ker je tam argument sinusa enak $0$.
3. Od tam dodajamo po $\frac{\pi}{4}$ in računamo:

| $x$ | argument $2(x - \frac{\pi}{4})$ | $\sin$ | $f(x)$ |
|---|---|---|---|
| $\frac{\pi}{4}$ | $0$ | $0$ | $1$ |
| $\frac{\pi}{2}$ | $\frac{\pi}{2}$ | $1$ | $3$ |
| $\frac{3\pi}{4}$ | $\pi$ | $0$ | $1$ |
| $\pi$ | $\frac{3\pi}{2}$ | $-1$ | $-1$ |
| $\frac{5\pi}{4}$ | $2\pi$ | $0$ | $1$ |

4. Točke povežemo z gladkim valom in ga ponavljamo levo in desno na vsak $\pi$.

Iz tabele vidiš vse: srednja črta $y = 1$, vrh $3$, dno $-1$, en val od $\frac{\pi}{4}$ do $\frac{5\pi}{4}$.

## Drugače: Bolj natančno

Zakaj je perioda funkcije $g(x) = \sin(bx)$ ravno $\frac{2\pi}{|b|}$? Iščemo najmanjši $T > 0$, za katerega velja $\sin\big(b(x + T)\big) = \sin(bx)$ za vsak $x$. Ker je $\sin(bx + bT) = \sin(bx)$ za vsak $x$ natanko takrat, ko je $bT$ večkratnik $2\pi$, je najmanjši tak $|b|T = 2\pi$, torej $T = \frac{2\pi}{|b|}$.

Vrstni red transformacij šteje. Graf $f(x) = A\sin\big(b(x - c)\big) + d$ dobiš iz grafa $\sin x$ tako:

1. skrčiš v smeri osi $x$ s faktorjem $\frac{1}{|b|}$ (pri $b < 0$ še zrcališ čez os $y$),
2. premakneš za $c$ v smeri osi $x$,
3. raztegneš v smeri osi $y$ s faktorjem $|A|$ (pri $A < 0$ še zrcališ čez os $x$),
4. premakneš za $d$ v smeri osi $y$.

Če bi premik naredil pred krčenjem, bi dobil napačen premik $\frac{c}{b}$ namesto $c$. Zato je pomembno, da $b$ izpostaviš.

Iz simetrije enotske krožnice velja $\sin(-x) = -\sin x$, zato je sinus **liha** funkcija (graf je simetričen glede na izhodišče). Ker je $\cos(-x) = \cos x$, je kosinus **soda** funkcija (graf je simetričen glede na os $y$).

## Preveri se

? Kaj velja za funkcijo $y = \sin x$?
- Njena osnovna perioda je $\pi$.
~ Na razdalji $\pi$ si sledita dve ničli, vmes pa je le vrh. Za cel val potrebuješ še dno. Periodo $\pi$ ima tangens.
- Največjo vrednost doseže pri $x = 0$.
~ Pri $x = 0$ je največji kosinus. Sinus je tam $0$, največji je pri $x = \frac{\pi}{2}$.
+ Njena osnovna perioda je $2\pi$, zaloga vrednosti pa $[-1, 1]$.
- Njena zaloga vrednosti so vsa realna števila.
~ To velja za tangens. Sinus je navpična koordinata točke na enotski krožnici, zato je med $-1$ in $1$.
> En cel obrat je $2\pi$; po njem se vrednosti ponovijo. Navpična koordinata točke na enotski krožnici je med $-1$ in $1$.

? Kolikšna je osnovna perioda funkcije $f(x) = \sin 4x$?
- $8\pi$
~ Periodo si pomnožil s $4$. Večji $b$ pomeni hitrejše ponavljanje, zato krajšo periodo.
+ $\frac{\pi}{2}$
- $2\pi$
~ Število pred $x$ v oklepaju vpliva na periodo. Amplitudo spremeni le $A$ pred sinusom, tu je $A = 1$.
> $T = \dfrac{2\pi}{|b|} = \dfrac{2\pi}{4} = \dfrac{\pi}{2}$.

? Maja je za $f(x) = \sin\left(2x - \frac{\pi}{3}\right)$ zapisala: »(1) $b = 2$, zato je osnovna perioda $\pi$. (2) Graf je glede na $y = \sin 2x$ premaknjen za $\frac{\pi}{3}$ v desno.« Kaj je narobe?
- Korak (1): perioda je $4\pi$.
~ Periodo si pomnožil z $2$. Korak (1) je pravilen: $T = \frac{2\pi}{2} = \pi$.
- Korak (2): premik je za $\frac{\pi}{3}$ v levo.
~ Minus te zavede. Pri $x - c$ s $c > 0$ gre graf v desno; napaka je v velikosti premika, ne v smeri.
+ Korak (2): premik je $\frac{\pi}{6}$ v desno, ker je treba najprej izpostaviti $2$.
- Napake ni.
~ Premik prebereš šele iz oblike $2(x - c)$. Brez izpostavljanja dobiš $\frac{\pi}{3}$, kar je dvakrat preveč.
> $2x - \frac{\pi}{3} = 2\left(x - \frac{\pi}{6}\right)$, zato je $c = \frac{\pi}{6}$: premik za $\frac{\pi}{6}$ v desno. Korak (1) je pravilen.

? Primerjaj funkciji $f(x) = 2\sin x$ in $g(x) = \sin 2x$. Kaj velja?
+ $f$ ima večjo amplitudo, $g$ krajšo periodo.
- $f$ ima krajšo periodo, $g$ večjo amplitudo.
~ Zamenjal si vlogi števil. Število pred sinusom raztegne val v višino, število ob $x$ v oklepaju ga stisne v širino.
- Obe imata amplitudo $2$ in periodo $\pi$.
~ Vsako število spremeni le eno lastnost: $2$ pred sinusom samo amplitudo, $2$ ob $x$ samo periodo.
- Funkciji sta enaki, ker lahko $2$ prestaviš pred sinus.
~ Sinus ni množenje: $f\left(\frac{\pi}{2}\right) = 2$, a $g\left(\frac{\pi}{2}\right) = \sin\pi = 0$.
> $f$ ima amplitudo $2$ in periodo $2\pi$, $g$ amplitudo $1$ in periodo $\frac{2\pi}{2} = \pi$. Val $f$ je višji, val $g$ gostejši.

? Lučka za obvestila na telefonu »diha«: njena svetlost je $s(t) = 40\cos(\pi t) + 50$ (v odstotkih, $t$ v sekundah). Med katerima vrednostma niha svetlost in koliko traja en utrip?
+ Svetlost niha med $10\,\%$ in $90\,\%$, en utrip traja $2\,\text{s}$.
- Svetlost niha med $-40\,\%$ in $40\,\%$, en utrip traja $2\,\text{s}$.
~ Prezrl si premik $d = 50$: ves val je dvignjen za $50$. Negativne svetlosti tudi ni.
- Svetlost niha med $10\,\%$ in $90\,\%$, en utrip traja $2\pi^2\,\text{s}$.
~ Periodo si pomnožil z $b = \pi$. Pravilno je deliti: $T = \frac{2\pi}{\pi} = 2\,\text{s}$.
- Svetlost niha med $50\,\%$ in $90\,\%$, en utrip traja $2\,\text{s}$.
~ Val niha na obe strani srednje črte $y = 50$: za $40$ nad njo in za $40$ pod njo.
> $|A| = 40$ in $d = 50$, zato svetlost niha od $50 - 40 = 10$ do $50 + 40 = 90$ odstotkov. Perioda je $T = \frac{2\pi}{\pi} = 2\,\text{s}$.

:::simboli
f | sinusna funkcija | f(x) = A\sin\big(b(x - c)\big) + d | |
x | kot v radianih (neodvisna spremenljivka) | | |
A | raztezek v smeri osi y | A = \frac{f_{\max} - f_{\min}}{2} | | pri $A > 0$; amplituda je $\lvert A \rvert$
b | koeficient ob x, ki določa periodo | b = \frac{2\pi}{T} | | pri $b > 0$; graf se vodoravno skrči s faktorjem $\frac{1}{\lvert b \rvert}$
c | premik grafa v smeri osi x | | |
d | premik grafa v smeri osi y | d = \frac{f_{\max} + f_{\min}}{2} | | srednja črta je $y = d$
T | osnovna perioda | T = \frac{2\pi}{\lvert b \rvert} | | v 1. razdelku $T$ točka na enotski krožnici
Z_f | zaloga vrednosti funkcije | Z_f = [d - \lvert A \rvert,\ d + \lvert A \rvert] | |
u | argument sinusa | | |
k | poljubno celo število | | |
r | polmer kroga v aplikaciji | r(t) = A\sin(bt) + d | mm |
t | čas | | s |
r_{\max} | največji polmer kroga | | mm |
r_{\min} | najmanjši polmer kroga | | mm |
f_{\max} | največja vrednost funkcije | | |
f_{\min} | najmanjša vrednost funkcije | | |
:::
