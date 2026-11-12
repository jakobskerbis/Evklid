---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tine trenira tek in en teden nosi pod kožo senzor, ki iz glukoze v medceličnini ocenjuje krvni sladkor in mu na telefon riše krivuljo. Po zajtrku ob 7.00 je krivulja vsak dan skoraj enaka: s $5\,\mathrm{mmol/L}$ se v eni uri dvigne na $7\,\mathrm{mmol/L}$ in se v naslednji uri vrne na $5$. V soboto ima tekmo, zato bo zajtrkoval šele ob 9.00. Trener hoče vedeti, kdaj bo sladkor najvišji in kdaj spet pri $5$.

Tinetu ni treba meriti znova. Privzemimo, da se telo na isti zajtrk odzove enako, le dve uri kasneje. Krivulja je ista, samo **premaknjena** za $2$ uri v desno: vrh bo ob 10.00, ob 11.00 bo sladkor spet pri $5$. Če senzor ni umerjen in kaže ves čas $0{,}5\,\mathrm{mmol/L}$ preveč, se krivulja premakne še navzgor. Oblike ne spremeni nobena od teh dveh sprememb.

Tako delujejo tudi grafi funkcij. Če poznaš nekaj osnovnih grafov, na primer $x^2$, $|x|$ in $\sqrt{x}$, lahko z nekaj premiki, zrcaljenji in raztegi narišeš na stotine drugih, ne da bi računal tabelo za vsakega posebej.

## Razlaga

Skušnjava je velika: v predpisu $(x - 2)^2$ stoji minus, torej se graf $x^2$ premakne za $2$ v levo. Zveni logično, a je narobe. Prepričaj se s tabelo. Osnovna funkcija je $f(x) = x^2$. Zraven sta dve spremenjeni funkciji: prištevanje zunaj in odštevanje znotraj oklepaja.

| $x$ | $x^2$ | $x^2 + 2$ | $(x - 2)^2$ |
|---|---|---|---|
| $-1$ | $1$ | $3$ | $9$ |
| $0$ | $0$ | $2$ | $4$ |
| $1$ | $1$ | $3$ | $1$ |
| $2$ | $4$ | $6$ | $0$ |
| $3$ | $9$ | $11$ | $1$ |
| $4$ | $16$ | $18$ | $4$ |

V tretjem stolpcu je vsaka vrednost za $2$ večja. Graf se dvigne za $2$, teme parabole (njena najnižja točka) gre iz $(0, 0)$ v $(0, 2)$. V četrtem stolpcu so ista števila $0, 1, 4$ kot pri $x^2$, le dve vrstici niže: najmanjša vrednost $0$ je zdaj pri $x = 2$. Teme se je premaknilo v **desno** za $2$, čeprav smo $2$ odšteli.

Slika kaže vse tri parabole iz tabele. Oblika je povsod ista, drugje je le teme.

:::risba graf
opis: Tri parabole v istem koordinatnem sistemu. Osnovna y = x² je siva in črtkana, teme ima v (0, 0). Parabola y = x² + 2 ima teme v (0, 2), torej 2 enoti višje. Parabola y = (x − 2)² ima teme v (2, 0), torej 2 enoti bolj desno.
x: -3 .. 5
y: -1 .. 7
enako: da
f: x^2 | siva črtkano
f: x^2 + 2 | modra
f: (x - 2)^2 | oranžna
točka: 0; 0 | (0, 0) | pod levo | siva
točka: 0; 2 | | | modra
točka: 2; 0 | (2, 0) | pod desno | oranžna
napis: 1,75; 5,6 | x^2 + 2 | levo | modra
napis: 4,9; 0,6 | (x − 2)^2 | levo | oranžna
napis: -1,9; 1,6 | x^2 | levo | siva
podnapis: Črtkana: x². Teme (0, 2): x² + 2, premik navzgor. Teme (2, 0): (x − 2)², premik v desno.
:::

**Vzporedni premik.** Iz vzorca dobimo pravili:

- $g(x) = f(x) + q$ premakne graf za $q$ navzgor (pri $q < 0$ navzdol);
- $g(x) = f(x - p)$ premakne graf za $p$ v desno (pri $p < 0$ v levo).

Zakaj v desno? Funkcija $g$ pri $x$ izračuna to, kar je $f$ izračunala pri $x - p$, torej $p$ enot bolj levo. Vsaka vrednost grafa $f$ se zato pri $g$ pojavi $p$ enot bolj desno.

S števili iz tabele, kjer je $p = 2$: pri $x = 3$ funkcija $(x - 2)^2$ izračuna $1^2 = 1$, torej isto kot $x^2$ pri $x = 1$. Enako je pri Tinetu: sobotni sladkor ob 10.00 je tak kot običajni ob 8.00.

Na spodnji sliki je parabola $y = (x - p)^2 + q$ pri $p = 2$ in $q = 1$, s temenom v $(2, 1)$; črtkana je osnovna $x^2$. V aplikaciji premikaj drsnik $p$ in glej samo teme: pri $p = 2$ stoji v predpisu $x - 2$, teme pa je pri $x = +2$. Nastavi še $p = -3$: pod sliko se izpiše $(x + 3)^2$, teme pa je pri $x = -3$. Nato premikaj $q$: teme gre gor in dol, levo in desno pa nič. Opazi še, da se oblika parabole ne spremeni pri nobenem drsniku; pri $p = 0$ in $q = 0$ se grafa pokrijeta: pod sliko piše $(x + 0)^2 + 0$, kar je $x^2$.

:::risba graf
opis: Parabola y = (x − p)² + q in črtkana osnovna parabola y = x². V aplikaciji se p in q spreminjata z drsnikoma; izbrano je p = {p} in q = {q}. Teme je v točki ({p}, {q}); črtkani črti vodita od temena do osi: p odčitaš na osi x, q na osi y.
x: -6 .. 6
y: -4 .. 8
enako: da
drsnik: p | -4 .. 4 | 1 | 2 | vodoravni premik p
drsnik: q | -3 .. 3 | 1 | 1 | navpični premik q
f: x^2 | siva črtkano
f: (x - p)^2 + q
črta: 0; q -> p; q | oranžna črtkano
črta: p; 0 -> p; q | oranžna črtkano
točka: p; q | | | oranžna
podnapis: p = {p}, q = {q}: y = (x {+(-p)})² {+q}; teme ({p}, {q})
:::

:::premisli
Kam se premakne teme parabole $y = (x + 3)^2 - 1$? Napovej, nato preveri z eno vrednostjo.
---
V $(-3, -1)$. Ker je $x + 3 = x - (-3)$, je $p = -3$, premik za $3$ v levo, nato $1$ navzdol. Preizkus: pri $x = -3$ je $0^2 - 1 = -1$.
:::

**Zrcaljenje čez os $x$.** Pri $g(x) = -f(x)$ vsaka vrednost spremeni predznak. Točka $(x, y)$ preide v $(x, -y)$, parabola $x^2$ se obrne navzdol.

**Zrcaljenje čez os $y$.** Pri $g(x) = f(-x)$ ima $g$ pri $x$ tisto, kar je $f$ imela pri $-x$. Točka $(x, y)$ preide v $(-x, y)$. Graf $\sqrt{x}$ leži desno od osi $y$, graf $\sqrt{-x}$ pa levo, saj je definiran za $x \le 0$.

Na sliki sledi točki $(4, 2)$ grafa $\sqrt{x}$: minus zunaj jo pošlje v $(4, -2)$, minus znotraj v $(-4, 2)$.

:::risba graf
opis: Trije grafi. Osnovni y = √x je siv in črtkan, začne se v (0, 0) in gre skozi (4, 2). Graf y = −√x leži pod osjo x, je zrcalna slika čez os x in gre skozi (4, −2). Graf y = √(−x) leži levo od osi y, je zrcalna slika čez os y in gre skozi (−4, 2).
x: -6 .. 6
y: -3 .. 3
enako: da
f: sqrt(x) | siva črtkano | 0 .. 6
f: -sqrt(x) | modra | 0 .. 6
f: sqrt(-x) | oranžna | -6 .. 0
točka: 4; 2 | (4, 2) | nad levo | siva
točka: 4; -2 | (4, −2) | pod levo | modra
točka: -4; 2 | (−4, 2) | nad desno | oranžna
napis: 5; 1,3 | √x | sredina | siva
napis: 5; -1,3 | −√x | sredina | modra
napis: -5; 1,3 | √(−x) | sredina | oranžna
podnapis: Črtkana: √x. Pod osjo x: −√x (zrcaljenje čez os x). Levo od osi y: √(−x) (zrcaljenje čez os y).
:::

**Raztezanje v smeri osi $y$.** Pri $g(x) = a \cdot f(x)$ z $a > 0$ se vsaka vrednost pomnoži z $a$: točka $(x, y)$ preide v $(x, ay)$. Pri $a > 1$ se graf raztegne stran od osi $x$ in postane strmejši; pri $0 < a < 1$ se skrči proti osi $x$. Pri negativnem $a$ se graf raztegne ali skrči s faktorjem $|a|$ in še zrcali čez os $x$.

Spodnja slika kaže $y = a \cdot |x|$ pri $a = 2$: točka $(1, 1)$ osnovnega grafa se dvigne v $(1, 2)$. V aplikaciji povleci drsnik $a$ od $2$ proti $0$ in naprej do $-3$. Opazi tri stvari: točka ostane na navpičnici $x = 1$, pri $a$ med $0$ in $1$ je graf položnejši od osnovnega, pri negativnem $a$ pa se »V« obrne navzdol. Vmes sta dva mejna primera: pri $a = 1$ se grafa pokrijeta, pri $a = 0$ se graf splošči v os $x$, ker so vse vrednosti $0$. Konica v $(0, 0)$ ves čas miruje, ker je $a \cdot 0 = 0$.

:::risba graf
opis: Graf y = a·|x| in črtkan osnovni graf y = |x|. V aplikaciji se a spreminja z drsnikom; izbrano je a = {a}. Točka (1; 1) osnovnega grafa preide v točko (1; {a}) na črtkani navpičnici x = 1. Od nove točke vodi vodoravna črtkana črta do osi y, kjer odčitaš a. Konica ostane v (0; 0).
x: -4 .. 4
y: -4 .. 4
enako: da
drsnik: a | -3 .. 3 | 0,5 | 2 | faktor a
f: abs(x) | siva črtkano
f: a*abs(x)
črta: 1; -4 -> 1; 4 | oranžna črtkano
črta: 0; a -> 1; a | oranžna črtkano
točka: 1; 1 | | | siva
točka: 1; a | | | oranžna
podnapis: y = a·|x| pri a = {a}: točka (1; 1) črtkanega grafa |x| preide v (1; {a}); od nje vodi črtica do osi y
:::

**Raztezanje v smeri osi $x$.** Pri $g(x) = f(kx)$ s $k > 0$ se graf v vodoravni smeri skrči s faktorjem $k$ (pri $0 < k < 1$ se v resnici raztegne). Točka $(x, y)$ preide v $\left(\frac{x}{k}, y\right)$. Razlog je isti kot pri premiku: $g$ pri $x$ izračuna to, kar $f$ pri $kx$, torej $k$-krat dlje od osi $y$. Vsaka vrednost se zato pojavi $k$-krat bliže osi $y$. Tudi tu sprememba znotraj oklepaja deluje »obratno«: $k = 2$ graf stisne na polovico širine. Preizkus: $x^2$ doseže $4$ pri $x = 2$, $(2x)^2$ pa že pri $x = 1$. Pri paraboli je $(2x)^2 = 4x^2$: vodoravna skrčitev s faktorjem $2$ da isti graf kot navpični razteg s faktorjem $4$.

Na spodnji sliki je $y = \sqrt{kx}$ pri $k = 2$ ob črtkanem $\sqrt{x}$. Osnovni graf doseže vrednost $2$ pri $x = 4$, novi že pri $x = 2$, ker je $\sqrt{2 \cdot 2} = 2$. V aplikaciji premikaj drsnik $k$ in opazuj, kje graf seka črto $y = 2$: vedno pri $x = \frac{4}{k}$. Pri $k = 4$ je to $x = 1$, pri $k = 0{,}5$ šele $x = 8$.

:::risba graf
opis: Graf y = √(kx) in črtkan osnovni graf y = √x. V aplikaciji se k spreminja z drsnikom; izbrano je k = {k}. Osnovni graf doseže vrednost 2 pri x = 4, novi pri x = {4/k}. Vodoravna črtkana črta označuje vrednost 2; od točke novega grafa na njej vodi navpična črtkana črta do osi x.
x: -1 .. 9
y: -1 .. 6
enako: da
drsnik: k | 0,5 .. 4 | 0,5 | 2 | faktor k pri x
f: sqrt(x) | siva črtkano | 0 .. 9
f: sqrt(k*x) | modra | 0 .. 9
črta: 0; 2 -> 9; 2 | oranžna črtkano
točka: 4; 2 | | | siva
črta: 4/k; 0 -> 4/k; 2 | oranžna črtkano
točka: 4/k; 2 | | | oranžna
podnapis: y = √(kx) pri k = {k}: vrednost 2 doseže pri x = {4/k}, črtkani √x pri x = 4
:::

**Več korakov hkrati.** Splošni predpis

$$g(x) = a \cdot f(x - p) + q$$

beri od znotraj navzven: premik za $p$ vodoravno, razteg in morebitno zrcaljenje z $a$, na koncu premik za $q$ navpično. Točka $(x, y)$ grafa $f$ preide v $(x + p,\ ay + q)$.

Vrstni red je pomemben. Točka $(1, 1)$ grafa $x^2$ gre pri »najprej krat $2$, nato plus $1$« v $(1, 3)$, pri »najprej plus $1$, nato krat $2$« pa v $(1, 4)$. Predpis $a \cdot f(x) + q$ pomeni prvo. Kadar je v korenu ali oklepaju minus pred $x$, ga najprej izpostavi: $\sqrt{2 - x}$ zapiši kot $\sqrt{-(x - 2)}$. To je graf $\sqrt{-x}$, premaknjen za $2$ v desno, ne v levo. Preizkus: pri $x = 2$ je vrednost $0$, pri $x = -2$ pa $\sqrt{4} = 2$; graf se začne v $(2, 0)$ in gre v levo.

:::premisli
Graf $f(x) = |x|$ zrcališ čez os $y$. Kaj se zgodi in zakaj? Kaj pa, če čez os $y$ zrcališ $x^3$?
---
Graf $|x|$ se ne spremeni, ker je $|x|$ soda funkcija: $|-x| = |x|$, graf je že simetričen glede na os $y$. Pri $x^3$ dobiš $(-x)^3 = -x^3$: ker je $x^3$ liha, zrcaljenje čez os $y$ da isti graf kot zrcaljenje čez os $x$.
:::

Vse preslikave na enem mestu:

| Predpis | $(x, y)$ gre v | Učinek |
|---|---|---|
| $f(x) + q$ | $(x,\ y + q)$ | premik navpično |
| $f(x - p)$ | $(x + p,\ y)$ | premik vodoravno |
| $-f(x)$ | $(x,\ -y)$ | zrcaljenje čez os $x$ |
| $f(-x)$ | $(-x,\ y)$ | zrcaljenje čez os $y$ |
| $a \cdot f(x)$ | $(x,\ ay)$ | razteg navpično |
| $f(kx)$ | $\left(\frac{x}{k},\ y\right)$ | skrčitev vodoravno |

Sprememba zunaj $f$ deluje navpično in tako, kot piše. Sprememba pri $x$ deluje vodoravno in obratno.

V simulaciji spodaj, »Premik, zrcaljenje in raztezanje grafa«, izberi $f(x) = \sqrt{x}$ ter nastavi $p = 2$ in $q = -1$. Opazuj, kam se pomakne začetna točka grafa. Nato vrni $p$ in $q$ na $0$ ter preklopi $b = -1$ (to da $f(-x)$: zrcaljenje čez os $y$) najprej pri $\sqrt{x}$ in potem pri $x^2$. Prej napovej, pri kateri se graf ne bo spremenil in zakaj.

## Rešeni primeri

### Primer 1 (lažji): parabola s premikom

Nariši graf $g(x) = (x - 3)^2 + 1$ iz grafa $f(x) = x^2$. Kje je teme?

**Podatki:** $f(x) = x^2$, $g(x) = (x - 3)^2 + 1$
**Iščemo:** teme in nekaj točk grafa $g$

:::formula
$g(x) = f(x - p) + q$: premik za $p$ v desno in $q$ navzgor; $(x, y) \mapsto (x + p,\ y + q)$
:::

**Rešitev:**

1. Primerjamo z $f(x - p) + q$: $p = 3$, $q = 1$.
2. Teme $(0, 0)$ preide v $(0 + 3,\ 0 + 1) = (3, 1)$.
3. Točki $(1, 1)$ in $(-1, 1)$ grafa $f$ preideta v $(4, 2)$ in $(2, 2)$. Preizkus: $g(4) = 1^2 + 1 = 2$.
4. Točka $(2, 4)$ preide v $(5, 5)$; $g(5) = 2^2 + 1 = 5$.
5. Odgovor: graf $g$ je parabola $x^2$, premaknjena za $3$ v desno in $1$ navzgor, s temenom v $(3, 1)$.

:::risba graf
opis: Črtkana osnovna parabola y = x² s temenom v (0, 0) in parabola y = (x − 3)² + 1 s temenom v (3, 1), ki gre skozi točke (2, 2), (4, 2) in (5, 5).
x: -3 .. 7
y: -1 .. 7
enako: da
f: x^2 | siva črtkano
f: (x - 3)^2 + 1 | modra
točka: 3; 1 | (3, 1) | pod | modra
točka: 2; 2 | | | modra
točka: 4; 2 | (4, 2) | pod desno | modra
točka: 5; 5 | (5, 5) | desno | modra
podnapis: Črtkano: x². Polna črta: (x − 3)² + 1 s temenom (3, 1); neoznačena točka je (2, 2).
:::

### Primer 2: razteg in zrcaljenje

Opiši, kako iz grafa $f(x) = |x|$ dobiš graf $g(x) = -2|x| + 4$. Določi vrh, ničle in zalogo vrednosti.

**Podatki:** $f(x) = |x|$, $g(x) = -2|x| + 4$
**Iščemo:** zaporedje preslikav, vrh, ničle, $Z_g$

:::formula
$g(x) = a \cdot f(x) + q$; $(x, y) \mapsto (x,\ ay + q)$
:::

**Rešitev:**

1. Primerjamo s pravilom: $a = -2$, $q = 4$. Faktor $2$ raztegne graf v smeri osi $y$: krak skozi $(1, 1)$ gre zdaj skozi $(1, 2)$, graf je strmejši.
2. Minus zrcali graf čez os $x$: »V« se obrne v »Λ«, točka $(1, 2)$ preide v $(1, -2)$.
3. Prištevanje $4$ dvigne vse za $4$: konica $(0, 0)$ gre v $(0, 4)$, točka $(1, -2)$ v $(1, 2)$. Preizkus: $g(1) = -2 + 4 = 2$.
4. Ničle iz $-2|x| + 4 = 0$: $|x| = 2$, torej $x = -2$ ali $x = 2$.
5. Po zrcaljenju je vrh najvišja točka, zato $Z_g = (-\infty, 4]$.
6. Odgovor: graf $|x|$ raztegnemo s faktorjem $2$, zrcalimo čez os $x$ in premaknemo za $4$ navzgor. Vrh je $(0, 4)$, ničli $\pm 2$, zaloga vrednosti $(-\infty, 4]$.

:::risba graf
opis: Črtkan osnovni graf y = |x| s konico v (0, 0) in graf y = −2|x| + 4, obrnjen navzdol, z vrhom v (0, 4), ničlama v (−2, 0) in (2, 0) ter točko (1, 2).
x: -4 .. 4
y: -3 .. 5
enako: da
f: abs(x) | siva črtkano
f: -2*abs(x) + 4 | modra
točka: 0; 4 | (0, 4) | desno | modra
točka: -2; 0 | −2 | nad levo | modra
točka: 2; 0 | 2 | nad desno | modra
točka: 1; 2 | (1, 2) | nad desno | modra
podnapis: Črtkano: |x|. Polna črta: −2|x| + 4 z vrhom (0, 4) in ničlama −2 in 2.
:::

### Primer 3 (težji): senzor za sladkor in pozen zajtrk

Tinetov krvni sladkor po zajtrku v preprostem modelu opisuje $m(t) = -2(t - 1)^2 + 7$ (v $\mathrm{mmol/L}$) za $0 \le t \le 2$, kjer je $t$ čas v urah od 7.00, ko zajtrkuje. 
Model je poenostavljen, a blizu meritvam. V raziskavi z neprekinjenim merjenjem pri $24$ zdravih odraslih (Freckmann in sod., 2007) je bil povprečni vrh po zajtrku $132\,\mathrm{mg/dL}$, to je približno $7{,}3\,\mathrm{mmol/L}$, dosežen $46$ do $50$ minut po obroku. Naš vrh, $7\,\mathrm{mmol/L}$ po $60$ minutah, je malo nižji in poznejši, prava krivulja pa ni simetrična.

V soboto Tine zajtrkuje $2\,\mathrm{h}$ kasneje, senzor pa ni umerjen in kaže ves čas $0{,}5\,\mathrm{mmol/L}$ preveč. Čas še vedno teče od 7.00.

1. Zapiši, kaj kaže senzor v soboto, $s(t)$.
2. Kdaj kaže največ in koliko?
3. Kdaj kaže vsaj $7\,\mathrm{mmol/L}$?
4. Denimo, da po kosilu vse poteka dvakrat počasneje: $n(t) = m\left(\frac{t}{2}\right)$, $t$ teče od kosila. Kdaj je vrh?

**Podatki:** $m(t) = -2(t - 1)^2 + 7$ ($\mathrm{mmol/L}$, $t$ v h, $0 \le t \le 2$), zamik $2\,\mathrm{h}$, napaka senzorja $+0{,}5\,\mathrm{mmol/L}$, meja $7\,\mathrm{mmol/L}$, po kosilu $n(t) = m\left(\frac{t}{2}\right)$
**Iščemo:** predpis $s(t)$, najvišjo vrednost, čas, ko je $s(t) \ge 7$, in vrh grafa $n$

:::formula
Zamik za $p$ v času: $m(t - p)$; dvig za $q$: $s(t) = m(t - p) + q$; $(t, y) \mapsto (t + p,\ y + q)$

Razteg v času: $m(kt)$; $(t, y) \mapsto \left(\frac{t}{k},\ y\right)$
:::

**Rešitev:**

1. Zajtrk je $2\,\mathrm{h}$ kasneje, zato graf $m$ premaknemo za $2$ v desno. Vsak $t$ zamenjamo s $t - 2$: $m(t - 2) = -2(t - 3)^2 + 7$, ker je $t - 2 - 1 = t - 3$.
2. Senzor kaže $0{,}5$ preveč, zato graf dvignemo za $0{,}5$: $s(t) = -2(t - 3)^2 + 7{,}5$ za $2 \le t \le 4$.
3. Vrh $(1, 7)$ grafa $m$ preide v $(1 + 2;\ 7 + 0{,}5) = (3;\ 7{,}5)$. Senzor kaže največ ob 10.00, in sicer $7{,}5\,\mathrm{mmol/L}$.
4. Preizkus na začetku: $s(2) = -2 \cdot 1 + 7{,}5 = 5{,}5$, kar je $m(0) + 0{,}5 = 5 + 0{,}5$.
5. Enačba $-2(t - 3)^2 + 7{,}5 = 7$ da $(t - 3)^2 = 0{,}25$, torej $t - 3 = \pm 0{,}5$ in $t = 2{,}5$ ali $t = 3{,}5$. Med tema časoma je parabola nad mejo, ker je obrnjena navzdol.
6. Pri $n(t) = m\left(\frac{t}{2}\right)$ je $k = \frac{1}{2}$: točka $(t, y)$ preide v $(2t, y)$, graf se vodoravno raztegne na dvojno širino. Vrh $(1, 7)$ gre v $(2, 7)$. Preizkus: $n(2) = m(1) = 7$.
7. Odgovor: $s(t) = -2(t - 3)^2 + 7{,}5$. Senzor kaže največ, $7{,}5\,\mathrm{mmol/L}$, ob 10.00, vsaj $7\,\mathrm{mmol/L}$ pa od 9.30 do 10.30. Po kosilu je vrh šele po $2$ urah.

:::risba graf
opis: Dve enaki paraboli, obrnjeni navzdol. Črtkana m(t) teče od t = 0 do t = 2 z vrhom v (1; 7). Polna s(t) teče od t = 2 do t = 4 z vrhom v (3; 7,5): je 2 uri bolj desno in 0,5 višje. Vodoravna črtkana črta pri 7 jo seka pri t = 2,5 in t = 3,5.
x: 0 .. 5 | 1 | t (h)
y: 4 .. 8 | 1 | mmol/L
f: -2*(x - 1)^2 + 7 | siva črtkano | 0 .. 2
f: -2*(x - 3)^2 + 7,5 | modra | 2 .. 4
črta: 0; 7 -> 5; 7 | oranžna črtkano
točka: 1; 7 | | | siva
napis: 1; 7,35 | (1; 7) | sredina | siva
točka: 3; 7,5 | (3; 7,5) | nad | modra
napis: 1; 5,6 | m(t) | sredina | siva
napis: 3; 6,5 | s(t) | sredina | modra
točka: 2,5; 7 | 2,5 | nad levo | oranžna
točka: 3,5; 7 | 3,5 | nad desno | oranžna
podnapis: Črtkana krivulja: običajen dan, m(t). Polna: sobota na senzorju, s(t). Vodoravna črta: meja 7 mmol/L. Os y se začne pri 4.
:::

### Primer 4: zdaj ti

Parabola na sliki nastane iz grafa $f(x) = x^2$ z raztegom in premikom. Teme ima v $(-2, -3)$ in gre skozi točko $(0, 5)$. Zapiši njen predpis.

:::risba graf
opis: Parabola, odprta navzgor, s temenom v točki (−2, −3). Gre skozi točko (0, 5) na osi y.
x: -6 .. 4
y: -4 .. 6
enako: da
f: 2*(x + 2)^2 - 3 | modra
točka: -2; -3 | teme (−2, −3) | pod | modra
točka: 0; 5 | (0, 5) | desno | modra
podnapis: S slike odčitaš teme (−2, −3) in točko (0, 5); faktor a izračunaš.
:::

**Podatki:** $f(x) = x^2$, teme $(-2, -3)$, točka $(0, 5)$
**Iščemo:** predpis $g(x) = a(x - p)^2 + q$

:::formula
$g(x) = a(x - p)^2 + q$, teme je v $(p, q)$
:::

**Rešitev:**

1. Iz temena: $p = -2$, $q = -3$, zato $g(x) = a(x + 2)^2 - 3$.
2. Zdaj ti: vstavi točko $(0, 5)$, izračunaj $a$ in zapiši predpis.

:::premisli
Kakšno enačbo dobiš, koliko je $a$ in kako se glasi $g(x)$?
---
Enačba je $5 = a \cdot 2^2 - 3$, torej $4a = 8$, $a = 2$ in $g(x) = 2(x + 2)^2 - 3$. Preizkus: $g(0) = 2 \cdot 4 - 3 = 5$.
:::

## Pogoste napake

- **Minus v oklepaju pomeni levo.** Učenec vidi $(x - 2)^2$ in premakne graf v levo. Narobe: vrednost, ki jo je $f$ imela pri $0$, ima $g$ šele pri $x = 2$. Premik je v desno. Preveri tako, da poiščeš $x$, pri katerem je oklepaj enak $0$.
- **$f(x) + 2$ in $f(x + 2)$ sta isto.** Prvo dvigne graf za $2$, drugo ga premakne za $2$ v levo. Pri $x^2$: $x^2 + 2$ ima teme $(0, 2)$, $(x + 2)^2$ pa $(-2, 0)$.
- **Zamenjani osi pri zrcaljenju.** $-f(x)$ zrcali čez os $x$ (spremenijo se vrednosti), $f(-x)$ čez os $y$ (spremenijo se vhodi). Minus zunaj deluje na $y$, minus znotraj na $x$.
- **»Faktor $2$ naredi parabolo širšo.«** $2x^2$ ima pri $x = 1$ vrednost $2$, ne $1$: graf je višji in zato videti ožji. Širšo parabolo da faktor med $0$ in $1$, na primer $\frac{1}{2}x^2$. Enako velja znotraj oklepaja: $(2x)^2$ grafa ne raztegne na dvojno širino, ampak ga stisne na polovico, saj doseže $4$ že pri $x = 1$.
- **Napačen vrstni red.** $2(x^2 + 1) = 2x^2 + 2$ ni isto kot $2x^2 + 1$. Razteg deluje na vse, kar je bilo prej; premik za $q$ pride na koncu.

## Povzetek

- $f(x) + q$: premik za $q$ navzgor ($q < 0$: navzdol).
- $f(x - p)$: premik za $p$ v desno ($p < 0$: v levo); sprememba v oklepaju deluje »obratno«.
- $-f(x)$: zrcaljenje čez os $x$; $f(-x)$: zrcaljenje čez os $y$ (soda funkcija se ne spremeni).
- $a \cdot f(x)$ z $a > 0$: razteg v smeri osi $y$ ($a > 1$ strmejši, $0 < a < 1$ položnejši).
- $f(kx)$ s $k > 0$: skrčitev v smeri osi $x$ s faktorjem $k$.
- $a \cdot f(x - p) + q$: točka $(x, y)$ preide v $(x + p,\ ay + q)$; teme $x^2$ gre v $(p, q)$.

## Drugače: Korak za korakom s številkami

Za $g(x) = 3\sqrt{x + 1} - 2$ sledi trem točkam skozi vse korake.

1. Na grafu $f(x) = \sqrt{x}$ izberi lahke točke: $(0, 0)$, $(1, 1)$, $(4, 2)$.
2. Oklepaj $x + 1 = x - (-1)$ da $p = -1$: vsak $x$ zmanjšaj za $1$. Točke so $(-1, 0)$, $(0, 1)$, $(3, 2)$.
3. Faktor $3$ pomnoži vrednosti: $(-1, 0)$, $(0, 3)$, $(3, 6)$.
4. Na koncu odštej $2$ od vrednosti: $(-1, -2)$, $(0, 1)$, $(3, 4)$.
5. Preizkus pri $x = 3$: $g(3) = 3\sqrt{4} - 2 = 6 - 2 = 4$. Ujema se.
6. Graf se začne v $(-1, -2)$, to je premaknjena začetna točka korena.

Še zrcaljenje, $g(x) = \sqrt{-x} + 1$. Minus pri vhodu obrne predznak vsakega $x$: iz $(0, 0)$, $(1, 1)$, $(4, 2)$ nastanejo $(0, 0)$, $(-1, 1)$, $(-4, 2)$. Prištevanje $1$ jih dvigne v $(0, 1)$, $(-1, 2)$, $(-4, 3)$. Preizkus: $g(-4) = \sqrt{4} + 1 = 3$. Zrcali se tudi definicijsko območje: namesto $x \ge 0$ je zdaj $x \le 0$.

## Drugače: Kot zgodba

Parabola $x^2$ je kulisa na odru, ki jo trije odrski delavci premikajo, ne da bi jo izdelali znova. Prvi jo porine za $p$ v desno. Kar je prej stalo pri $0$, zdaj stoji pri $p$, zato mora biti oklepaj enak $0$ pri $x = p$: napiše $x - p$. Drugi jo z vrvmi raztegne navzgor, da je dvakrat višja: pred vse napiše $2$. Če jo obrne na glavo, doda še minus. Tretji z dvigalom dvigne tla odra za $q$ in na konec doda $+\,q$.

Ko na koncu pogledaš predpis $2(x - p)^2 + q$, iz njega razbereš vso zgodbo: kdo je kuliso porinil, kdo raztegnil in kdo dvignil.

## Preveri se

? Razvrsti parabole od najožje do najširše.
1. $(2x)^2$
2. $3x^2$
3. $x^2 + 5$
4. $\frac{1}{2}x^2$
> Širino določa samo faktor: $(2x)^2 = 4x^2$ je najožja, sledi $3x^2$. Prištevanje $5$ parabolo le dvigne, zato je $x^2 + 5$ široka kot $x^2$. Faktor $\frac{1}{2}$ jo razširi.

? Točka $(4, 2)$ leži na grafu $f(x) = \sqrt{x}$. Graf preslikamo v $g(x) = -2\sqrt{x - 1} + 3$. Vpiši koordinato $y$ točke, v katero preide $(4, 2)$.
= -1 | 0,01
~ 7 | Izpustil si minus pred $2$. Negativen faktor vrednost še zrcali čez os $x$.
~ -10 | Najprej si prištel $3$ in šele nato množil z $-2$. Razteg pride pred premikom $q$.
~ -0,46 | To je $g(4)$. Točka se premakne tudi vodoravno, v $x = 5$.
> Točka $(x, y)$ preide v $(x + p,\ ay + q)$: $x = 4 + 1 = 5$ in $y = -2 \cdot 2 + 3 = -1$. Nova točka je $(5, -1)$.

? Zakaj graf $g(x) = f(x - 3)$ leži $3$ enote desno od grafa $f$?
- Ker se $3$ odšteje od vrednosti funkcije.
~ Odštevanje od vrednosti bi bilo $f(x) - 3$ in bi graf spustilo navzdol.
- Ker vsak minus zrcali graf čez os $y$.
~ Zrcali le minus pred celim $x$, kot v $f(-x)$. Tu se od $x$ odšteva število.
+ Ker ima $g$ pri $x$ vrednost, ki jo ima $f$ pri $x - 3$, torej $3$ enote bolj levo.
- Ker se vsaki točki grafa od koordinate $x$ odšteje $3$.
~ Potem bi šel graf v levo. Koordinati $x$ se $3$ prišteje: $(x, y)$ preide v $(x + 3, y)$.
> Vsaka vrednost grafa $f$ se pri $g$ pojavi $3$ enote bolj desno, zato je cel graf premaknjen v desno.

? Na sliki je graf $g(x) = a|x - p| + q$. Z grafa odčitaj faktor $a$.
:::risba graf
opis: Graf v obliki obrnjene črke V na mreži s korakom 1; vrh je označen s točko brez koordinat. Lego vrha in strmino krakov je treba odčitati z mreže.
x: -3 .. 5
y: -4 .. 4
enako: da
f: -2*abs(x - 1) + 3 | modra
točka: 1; 3 | | | modra
podnapis: Graf g; mreža ima korak 1
:::
= -2 | 0,01
~ 2 | Strmino si odčital prav, a graf je obrnjen navzdol. Zrcaljenje čez os $x$ pomeni negativen $a$.
~ -0,5 | Zamenjal si smeri: za $1$ v desno od vrha se graf spusti za $2$, ne za $0{,}5$.
~ 3 | To je $q$, višina vrha. Faktor $a$ pove, kako strma sta kraka.
~ 1 | To je $p$, lega vrha na osi $x$.
> Vrh je v $(1, 3)$. En korak desno od vrha je graf za $2$ niže, pri $|x|$ pa bi bil za $1$ više: $a = -2$ in $g(x) = -2|x - 1| + 3$.

? Žan riše graf $g(x) = -|x - 2| + 3$ iz grafa $|x|$ v treh korakih. Kateri korak je napačen?
- 1. korak: »Zaradi $x - 2$ graf premaknem za $2$ v desno, konica je v $(2, 0)$.«
~ Minus v oklepaju res zavede, a korak je pravilen: oklepaj je enak $0$ pri $x = 2$, zato je konica tam.
+ 2. korak: »Zaradi minusa spredaj graf zrcalim čez os $y$.«
- 3. korak: »Zaradi $+\,3$ graf dvignem za $3$, vrh je v $(2, 3)$.«
~ Prištevanje zunaj res dvigne graf. Preizkus: $g(2) = -0 + 3 = 3$, vrh je v $(2, 3)$.
> Minus zunaj spremeni predznak vrednosti, zato zrcali čez os $x$: »V« se obrne navzdol. Čez os $y$ bi zrcalil minus pri vhodu, $f(-x)$.

? Graf $T(t)$ kaže, kako se segreva zrak v učilnici, ko hišnik ob času $t = 0$ vklopi ogrevanje ($t$ merimo v minutah). Jutri ga bo vklopil $5$ minut kasneje, vse drugo bo enako. Čas $t$ še vedno štejemo od trenutka, ko ga je vklopil danes. Kateri predpis opisuje jutrišnjo temperaturo za $t \ge 5$?
+ $T(t - 5)$
- $T(t + 5)$
~ Plus v oklepaju premakne graf v levo, segrevanje bi se začelo prej.
- $T(t) - 5$
~ To bi pomenilo zrak, ki je ves čas za $5$ stopinj hladnejši, ne zamika v času.
> Jutri ima zrak ob času $t$ tisto temperaturo, kot jo je danes imel ob $t - 5$. Graf se premakne za $5$ minut v desno.

:::simboli
f | osnovna funkcija | |
g | preslikana (transformirana) funkcija | g(x) = a \cdot f(x - p) + q |
x | neodvisna spremenljivka | |
y | vrednost funkcije (ordinata točke grafa) | |
a | faktor raztega v smeri osi $y$ | | | pri $a < 0$ še zrcaljenje čez os $x$
p | vodoravni premik | | | $p > 0$ v desno
q | navpični premik | | | $q > 0$ navzgor
m | krvni sladkor na običajen dan | m(t) = -2(t - 1)^2 + 7 | mmol/L
t | čas | | | v Primeru 3 v urah od 7.00, v kvizu v minutah
T | temperatura zraka v učilnici | | ^\circ\mathrm{C}
Z_g | zaloga vrednosti funkcije $g$ | |
b | faktor v simulaciji | | | pri $p = 0$ da $b = -1$ graf $f(-x)$
s | vrednost na senzorju v soboto | s(t) = m(t - p) + q | mmol/L
k | faktor skrčitve v smeri osi $x$ | | | $k > 0$
n | krvni sladkor po kosilu v modelu | n(t) = m\left(\frac{t}{2}\right) | mmol/L
:::

<<RACUN
vrednost: (4-3)^2+1 | 2
vrednost: (5-3)^2+1 | 5
resi: -2*abs(x)+4=0 | x | -2, 2
enako: -2*((t-2)-1)^2+7+0.5 | -2*(t-3)^2+7.5
resi: -2*(t-3)^2+7.5=7 | t | 2.5, 3.5
vrednost: -2*(2/2-1)^2+7 | 7
vrednost: 132.3/18.016 | 7.3
resi: 5=4*a-3 | a | 2
vrednost: 2*(0+2)^2-3 | 5
vrednost: 3*sqrt(3+1)-2 | 4
enako: (2*x)^2 | 4*x^2
vrednost: -2*2+3 | -1
vrednost: -2*sqrt(4-1)+3 | -0.46
vrednost: -2*abs(2-1)+3 | 1
>>
