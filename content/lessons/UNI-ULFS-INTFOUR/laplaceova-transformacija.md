---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na merilni postaji ob akumulacijskem jezeru opazijo, da je tovarna gorvodno začela spuščati vodo z nitratom. Hidrolog mora hitro oceniti, kako bo koncentracija v jezeru rasla, kdaj preseže mejno vrednost in kaj se zgodi, ko izpust čez pet dni ustavijo. Model je preprosta linearna diferencialna enačba, a desna stran se ob izklopu skokovito spremeni, začetna koncentracija pa ni nič.

Klasično reševanje (homogena rešitev, nastavek, konstante iz pogojev) tu postane okorno: vsak odsek rešiš posebej in rešitve zlepiš. **Laplaceova transformacija** enačbo prevede v algebrsko enačbo za novo funkcijo $Y(s)$; začetni pogoji so v njej že vključeni, skok desne strani pa je le faktor $e^{-Ts}$. Algebro rešiš, nato se z **inverzno transformacijo** vrneš k $y(t)$.

Potrebuješ integral s parametrom, integracijo po delih, razcep racionalne funkcije na parcialne ulomke in linearne diferencialne enačbe. Fourierovo transformacijo že poznaš; Laplaceova je njena »enostranska« sestra za procese, ki se začnejo ob $t = 0$.

## Razlaga

**1. Najprej en primer.** Reši $y' + 2y = 4$, $y(0) = 1$. Obe strani pomnožimo z $e^{-st}$ in integriramo od $0$ do $\infty$; dobljeno funkcijo spremenljivke $s$ označimo z $Y(s)$. Za odvod z integracijo po delih:

$$\int_0^\infty e^{-st}y'\,dt = \big[e^{-st}y\big]_0^\infty + s\int_0^\infty e^{-st}y\,dt = sY - y(0),$$

če $e^{-st}y \to 0$. Za konstanto je $\int_0^\infty 4e^{-st}\,dt = \frac4s$ pri $s > 0$. Enačba postane algebrska:

$$sY - 1 + 2Y = \frac4s.$$

Od tod $Y = \frac{s + 4}{s(s + 2)} = \frac2s - \frac{1}{s + 2}$. Ker je $\frac2s$ slika konstante $2$ in $\frac{1}{s+2}$ slika $e^{-2t}$, je $y = 2 - e^{-2t}$. Preizkus: $y(0) = 1$ in $y' + 2y = 2e^{-2t} + 4 - 2e^{-2t} = 4$. Brez nastavka in brez posebnega določanja konstante.

**2. Definicija.** Naj bo $f$ definirana za $t \ge 0$.

**Definicija.** **Laplaceova transformiranka** funkcije $f$ je

$$F(s) = \int_0^\infty e^{-st} f(t)\,dt,$$

za tiste $s$, za katere posplošeni integral konvergira. Pišemo $F = \mathcal{L}\{f\}$ in $f = \mathcal{L}^{-1}\{F\}$; $f$ je **original**, $F$ **slika**.

**Definicija.** Funkcija $f$ je **eksponentnega reda** $a$, če obstajata $M > 0$ in $t_0 \ge 0$, da je $|f(t)| \le Me^{at}$ za vse $t \ge t_0$. Funkcija je **odsekoma zvezna** na $[0, \infty)$, če ima na vsakem omejenem intervalu le končno mnogo skokov s končnimi limitami.

**Izrek (obstoj).** Če je $f$ odsekoma zvezna na $[0, \infty)$ in eksponentnega reda $a$, potem $F(s)$ obstaja (integral absolutno konvergira) za vse $s > a$, in velja $F(s) \to 0$, ko $s \to \infty$.

**Dokaz.** Na $[0, t_0]$ je $f$ omejena, integral tam obstaja. Za $t \ge t_0$ je $|e^{-st}f(t)| \le Me^{-(s-a)t}$, in $\int_{t_0}^\infty Me^{-(s-a)t}\,dt = \frac{M e^{-(s-a)t_0}}{s - a}$ je končen pri $s > a$. Po primerjalnem kriteriju integral absolutno konvergira. Obe oceni gresta pri $s \to \infty$ proti $0$. $\square$

Polinomi, $e^{at}$, $\sin$ in $\cos$ so eksponentnega reda; $e^{t^2}$ ni, saj raste hitreje od vsake $e^{at}$.

**3. Osnovne slike.** Za $f = e^{at}$ in $s > a$:

$$\mathcal{L}\{e^{at}\} = \int_0^\infty e^{-(s-a)t}\,dt = \frac{1}{s - a}.$$

Pri $a = 0$ dobimo $\mathcal{L}\{1\} = \frac1s$. Z $a = i\omega$ in Eulerjevo formulo je $\frac{1}{s - i\omega} = \frac{s + i\omega}{s^2 + \omega^2}$; realni del je slika kosinusa, imaginarni sinusa. Z integracijo po delih in indukcijo sledi $\mathcal{L}\{t^n\} = \frac{n!}{s^{n+1}}$.

| $f(t)$ | $F(s)$ | za |
|---|---|---|
| $1$ | $\frac1s$ | $s > 0$ |
| $t^n$ | $\frac{n!}{s^{n+1}}$ | $s > 0$ |
| $e^{at}$ | $\frac{1}{s-a}$ | $s > a$ |
| $\cos\omega t$ | $\frac{s}{s^2+\omega^2}$ | $s > 0$ |
| $\sin\omega t$ | $\frac{\omega}{s^2+\omega^2}$ | $s > 0$ |

**4. Lastnosti.** Naj bo $\mathcal{L}\{f\} = F$ in $\mathcal{L}\{g\} = G$.

- **Linearnost:** $\mathcal{L}\{\alpha f + \beta g\} = \alpha F + \beta G$, ker je integral linearen.
- **Premik v $s$ (dušenje):** $\mathcal{L}\{e^{at}f(t)\} = F(s - a)$. Faktor $e^{at}$ se v integralu združi z $e^{-st}$ v $e^{-(s-a)t}$.
- **Premik v $t$ (zakasnitev):** z enotsko stopnico $u(t - T)$, ki je $0$ za $t < T$ in $1$ za $t \ge T$, velja $\mathcal{L}\{u(t - T)f(t - T)\} = e^{-Ts}F(s)$ za $T \ge 0$. Substitucija $\tau = t - T$ izloči $e^{-sT}$ iz integrala.

**Izrek (slika odvoda).** Naj bo $f$ zvezna na $[0, \infty)$ in eksponentnega reda $a$, $f'$ pa odsekoma zvezna. Potem za $s > a$ velja

$$\mathcal{L}\{f'\} = sF(s) - f(0).$$

**Dokaz.** Integracija po delih: $\int_0^R e^{-st}f'\,dt = e^{-sR}f(R) - f(0) + s\int_0^R e^{-st}f\,dt$. Ker je $|e^{-sR}f(R)| \le Me^{-(s-a)R} \to 0$ pri $s > a$, v limiti $R \to \infty$ dobimo trditev. (Če ima $f'$ skoke, integral razdelimo na odseke; zveznost $f$ poskrbi, da se robni členi v notranjih točkah odštejejo.) $\square$

Če izrek uporabimo na $f'$, sledi

$$\mathcal{L}\{f''\} = s^2F(s) - sf(0) - f'(0).$$

Odvajanje se v sliki spremeni v množenje s $s$, začetne vrednosti pa se odštejejo. Zato je transformacija tako prikladna za začetne probleme.

:::premisli
Preveri izrek na $f = e^{at}$: kaj dobiš na levi in kaj na desni? Zakaj je pomembno, da odštejemo $f(0)$?
---
Leva stran: $\mathcal{L}\{ae^{at}\} = \frac{a}{s - a}$. Desna: $\frac{s}{s - a} - 1 = \frac{a}{s - a}$. Funkciji $e^{at}$ in $e^{at} + 5$ imata isti odvod, torej isto sliko odvoda, njuna $sF(s)$ pa se razlikujeta za $5$. Člen $-f(0)$ to razliko ravno odšteje; brez njega bi isti odvod dobil dve različni sliki.
:::

**5. Inverzna transformacija.** Da je vrnitev k originalu smiselna, zagotavlja:

**Izrek (Lerch, enoličnost).** Če sta $f$ in $g$ zvezni na $[0, \infty)$, eksponentnega reda in imata isto sliko za vse dovolj velike $s$, je $f = g$ na $[0, \infty)$.

V praksi je slika racionalna funkcija $\frac{P(s)}{Q(s)}$ s $\deg P < \deg Q$. Inverz poiščemo v treh korakih:

1. razcepimo $Q$ na linearne in nerazcepne kvadratne faktorje;
2. zapišemo parcialne ulomke; pri enojnem faktorju $s - a$ je koeficient $A = \frac{P(a)}{Q'(a)}$ (ali pokrijemo faktor in vstavimo $s = a$);
3. kvadratnemu faktorju dopolnimo do popolnega kvadrata $(s + \alpha)^2 + \beta^2$ in uporabimo premik v $s$: $\frac{s + \alpha}{(s+\alpha)^2 + \beta^2} \mapsto e^{-\alpha t}\cos\beta t$, $\frac{\beta}{(s+\alpha)^2 + \beta^2} \mapsto e^{-\alpha t}\sin\beta t$.

Ničle imenovalca imenujemo **poli** slike. Vsak pol $a$ da v originalu člen $e^{at}$, par $-\alpha \pm i\beta$ da dušeno nihanje, $k$-kratni pol pa še faktorje $t, \dots, t^{k-1}$ (iz $\mathcal{L}\{t^n e^{at}\} = \frac{n!}{(s-a)^{n+1}}$).

:::premisli
Slika rešitve ima pole $-0{,}5$; $-2 + 3i$ in $-2 - 3i$. Kateri člen originala bo po dolgem času prevladoval in ali bo rešitev nihala?
---
Prevlada $e^{-0{,}5t}$, ker pada najpočasneje (pol, ki je najbližje imaginarni osi). Nihajni del $e^{-2t}(\dots)$ hitro izzveni, zato rešitev pozneje ne niha več in monotono pojema.
:::

**6. Recept za začetni problem.** Za $y'' + py' + qy = f(t)$ s konstantama $p$, $q$ in pogojema $y(0)$, $y'(0)$:

1. transformiraj obe strani z izrekom o sliki odvoda;
2. izrazi $Y(s)$;
3. razcepi na parcialne ulomke in s tabelo preberi $y(t)$;
4. preveri $y(0)$ in $y'(0)$.

## Rešeni primeri

### Primer 1 (lažji)

Poišči original funkcije $F(s) = \frac{3s + 5}{(s + 1)(s + 3)}$.

**Podatki:** $F(s) = \frac{3s + 5}{(s + 1)(s + 3)}$
**Iščemo:** $f(t) = \mathcal{L}^{-1}\{F\}$

:::formula
$\frac{P(s)}{(s - a)(s - b)} = \frac{A}{s - a} + \frac{B}{s - b}$; $\mathcal{L}^{-1}\left\{\frac{1}{s - a}\right\} = e^{at}$
:::

**Rešitev:**

1. Nastavek: $\frac{3s + 5}{(s+1)(s+3)} = \frac{A}{s + 1} + \frac{B}{s + 3}$.
2. Pokrijemo $s + 1$ in vstavimo $s = -1$: $A = \frac{-3 + 5}{2} = 1$.
3. Pokrijemo $s + 3$ in vstavimo $s = -3$: $B = \frac{-9 + 5}{-2} = 2$.
4. Pol $-1$ da $e^{-t}$, pol $-3$ da $e^{-3t}$ (pozor na predznak).
5. Odgovor: $f(t) = e^{-t} + 2e^{-3t}$.

### Primer 2

Ribnik napaja potok s koncentracijo nitrata $c_\mathrm{v} = 50\,\mathrm{mg/L}$; razmerje pretoka in prostornine je $k = 0{,}2\,\mathrm{dan^{-1}}$. Ob $t = 0$ je v ribniku $c(0) = 10\,\mathrm{mg/L}$. Koncentracija ustreza enačbi $c' + kc = kc_\mathrm{v}$. Določi $c(t)$ in čas, ko doseže $40\,\mathrm{mg/L}$.

**Podatki:** $c_\mathrm{v} = 50\,\mathrm{mg/L}$, $k = 0{,}2\,\mathrm{dan^{-1}}$, $c(0) = 10\,\mathrm{mg/L}$, mejna vrednost $40\,\mathrm{mg/L}$
**Iščemo:** $c(t)$ in čas $t_1$, ko je $c(t_1) = 40\,\mathrm{mg/L}$

:::formula
$\mathcal{L}\{c'\} = sC - c(0)$; $\mathcal{L}\{1\} = \frac1s$; $\mathcal{L}\{e^{at}\} = \frac{1}{s-a}$
:::

**Rešitev:**

1. Desna stran je $kc_\mathrm{v} = 10\,\mathrm{mg\,L^{-1}\,dan^{-1}}$; čas merimo v dnevih.
2. Transformiramo: $sC - 10 + 0{,}2C = \frac{10}{s}$.
3. Izrazimo: $C = \frac{10s + 10}{s(s + 0{,}2)}$.
4. Razcep: $C = \frac{A}{s} + \frac{B}{s + 0{,}2}$; pri $s = 0$: $A = \frac{10}{0{,}2} = 50$; pri $s = -0{,}2$: $B = \frac{-2 + 10}{-0{,}2} = -40$.
5. Original: $c(t) = 50 - 40e^{-0{,}2t}$ (v $\mathrm{mg/L}$). Preizkus: $c(0) = 50 - 40 = 10$.
6. Pogoj $50 - 40e^{-0{,}2t_1} = 40$ da $e^{-0{,}2t_1} = \frac14$, $t_1 = \frac{\ln 4}{0{,}2}$.
7. $t_1 = 6{,}93\,\mathrm{dneva}$.
8. Odgovor: $c(t) = 50 - 40e^{-0{,}2t}\,\mathrm{mg/L}$; mejo $40\,\mathrm{mg/L}$ doseže po približno $6{,}9$ dneva in se približuje vrednosti potoka $50\,\mathrm{mg/L}$.

### Primer 3 (težji)

Reši začetni problem $y'' + 2y' + 5y = 8e^{-t}$, $y(0) = 0$, $y'(0) = 2$.

**Podatki:** enačba $y'' + 2y' + 5y = 8e^{-t}$, $y(0) = 0$, $y'(0) = 2$
**Iščemo:** rešitev $y(t)$

:::formula
$\mathcal{L}\{y''\} = s^2Y - sy(0) - y'(0)$; $\mathcal{L}\{e^{at}f(t)\} = F(s - a)$; $\mathcal{L}\{\cos\omega t\} = \frac{s}{s^2+\omega^2}$, $\mathcal{L}\{\sin\omega t\} = \frac{\omega}{s^2+\omega^2}$
:::

**Rešitev:**

1. Transformiramo: $s^2Y - 2 + 2sY + 5Y = \frac{8}{s + 1}$, saj sta $y(0) = 0$ in $y'(0) = 2$.
2. Ker je $s^2 + 2s + 5 = (s + 1)^2 + 4$, je $Y = \frac{2}{(s+1)^2 + 4} + \frac{8}{(s + 1)\big((s+1)^2 + 4\big)}$.
3. Vsi členi so funkcije $u = s + 1$, zato po premiku v $s$ najprej poiščemo original za spremenljivko $u$ in ga na koncu pomnožimo z $e^{-t}$.
4. Razcep: $\frac{8}{u(u^2 + 4)} = \frac{A}{u} + \frac{Bu + D}{u^2 + 4}$; pri $u = 0$ je $A = \frac84 = 2$. Iz $8 = 2(u^2 + 4) + (Bu + D)u$ sledi $B = -2$, $D = 0$.
5. Torej $Y = \frac{2}{u} - \frac{2u}{u^2 + 4} + \frac{2}{u^2 + 4}$ z $u = s + 1$.
6. Originali v $u$: $\frac2u \mapsto 2$; $\frac{2u}{u^2+4} \mapsto 2\cos 2t$; $\frac{2}{u^2+4} \mapsto \sin 2t$.
7. Premik v $s$ za $-1$ pomnoži z $e^{-t}$: $y = e^{-t}(2 - 2\cos 2t + \sin 2t)$.
8. Preizkus: $y(0) = 2 - 2 + 0 = 0$; $y' = e^{-t}(-2 + 4\cos 2t + 3\sin 2t)$, torej $y'(0) = -2 + 4 = 2$.
9. Odgovor: $y = e^{-t}(2 - 2\cos 2t + \sin 2t)$. Desna stran $8e^{-t}$ da »nenihajoči« del $2e^{-t}$, lastno dušeno nihanje pa del s kosinusom in sinusom.

### Primer 4 – zdaj ti

Utež na dušeni vzmeti ustreza $y'' + 4y' + 13y = 0$, $y(0) = 2$, $y'(0) = -2$. Določi $y(t)$.

**Podatki:** $y'' + 4y' + 13y = 0$, $y(0) = 2$, $y'(0) = -2$
**Iščemo:** $y(t)$

:::formula
$\mathcal{L}\{y''\} = s^2Y - sy(0) - y'(0)$; $\frac{s+\alpha}{(s+\alpha)^2+\beta^2} \mapsto e^{-\alpha t}\cos\beta t$, $\frac{\beta}{(s+\alpha)^2+\beta^2} \mapsto e^{-\alpha t}\sin\beta t$
:::

**Rešitev:**

1. Transformiramo: $s^2Y - 2s + 2 + 4(sY - 2) + 13Y = 0$.
2. Izrazimo: $Y = \frac{2s + 6}{s^2 + 4s + 13} = \frac{2s + 6}{(s + 2)^2 + 9}$.
3. Števec zapiši kot $2(s + 2) + \dots$ in s premikom v $s$ preberi original. Preveri $y(0)$.

:::premisli
Kakšen je $y(t)$?
---
$2s + 6 = 2(s + 2) + 2$, torej $Y = 2\frac{s + 2}{(s+2)^2 + 9} + \frac23 \cdot \frac{3}{(s+2)^2 + 9}$ in $y = e^{-2t}\left(2\cos 3t + \frac23\sin 3t\right)$; $y(0) = 2$.
:::

## Pogoste napake

- **Predznak pri polu.** Iz $\frac{1}{s + 2}$ nastane $e^{-2t}$, ne $e^{2t}$: pol je $s = -2$. Pomaga, če vedno pišeš $\frac{1}{s - a}$ in prebereš $a$.
- **Pozabljen začetni pogoj.** $\mathcal{L}\{y'\} = sY$ velja le pri $y(0) = 0$. Pri $\mathcal{L}\{y''\}$ odštejemo oba člena, $sy(0)$ in $y'(0)$; pogosto manjka $s$ pri $sy(0)$.
- **Slika produkta ni produkt slik.** $\mathcal{L}\{t\sin t\} \ne \frac{1}{s^2} \cdot \frac{1}{s^2+1}$. Produkt slik je slika **konvolucije** (glej »Bolj natančno«), ne produkta originalov.
- **Zamenjana sinus in kosinus.** V števcu je $s$ pri kosinusu in $\omega$ pri sinusu. Pri $\frac{2}{s^2 + 4}$ je original $\sin 2t$, ne $2\sin 2t$.
- **Napačna zakasnitev.** $e^{-Ts}F(s)$ je slika $u(t - T)f(t - T)$, ne $u(t - T)f(t)$. Pred transformacijo zapiši funkcijo kot zamaknjeno, na primer $u(t - 5)\,t = u(t - 5)\big((t - 5) + 5\big)$.

## Povzetek

- $F(s) = \int_0^\infty e^{-st}f(t)\,dt$ obstaja za $s > a$, če je $f$ odsekoma zvezna in eksponentnega reda $a$.
- Tabela: $1 \mapsto \frac1s$, $t^n \mapsto \frac{n!}{s^{n+1}}$, $e^{at} \mapsto \frac{1}{s-a}$, $\cos\omega t \mapsto \frac{s}{s^2+\omega^2}$, $\sin\omega t \mapsto \frac{\omega}{s^2+\omega^2}$.
- Lastnosti: linearnost; $e^{at}f \mapsto F(s - a)$; $u(t-T)f(t-T) \mapsto e^{-Ts}F$; $f' \mapsto sF - f(0)$; $f'' \mapsto s^2F - sf(0) - f'(0)$.
- Inverz: parcialni ulomki, dopolnitev do kvadrata, premik v $s$; enoličnost zagotavlja Lerchov izrek.
- Začetni problem: transformiraj, izrazi $Y$, razcepi, preberi original, preveri pogoje.

## Za izpit

Znati moraš povedati:

- definicijo Laplaceove transformiranke in funkcije eksponentnega reda,
- izrek o obstoju s pogoji in dokazom (primerjava z $Me^{-(s-a)t}$),
- izpeljavo slik $e^{at}$, $\cos\omega t$, $\sin\omega t$ in obeh premikov,
- izrek o sliki odvoda s pogoji in dokazom ter posledico za $f''$,
- Lerchov izrek (pomen za inverz) in postopek s parcialnimi ulomki.

### Naloga 1

V ribnik iz Primera 2 ($k = 0{,}2\,\mathrm{dan^{-1}}$), ki je bil sprva brez nitrata, tovarna $5$ dni spušča vodo, tako da je desna stran enačbe $c' + 0{,}2c = f(t)$ enaka $f = 10\,\mathrm{mg\,L^{-1}\,dan^{-1}}$ za $0 \le t < 5$ in $0$ pozneje. Določi $c(t)$ za vse $t \ge 0$, največjo koncentracijo in koncentracijo po $10$ dneh.

**Rešitev:**

1. Desno stran zapišemo s stopnico: $f(t) = 10\big(1 - u(t - 5)\big)$, torej $F(s) = \frac{10}{s}\left(1 - e^{-5s}\right)$.
2. Transformiramo ($c(0) = 0$): $(s + 0{,}2)C = F$, torej $C = \left(1 - e^{-5s}\right)G(s)$ z $G = \frac{10}{s(s + 0{,}2)}$.
3. Razcep: $G = \frac{50}{s} - \frac{50}{s + 0{,}2}$, original $g(t) = 50\left(1 - e^{-0{,}2t}\right)$.
4. Po premiku v $t$: $c(t) = g(t) - u(t - 5)\,g(t - 5)$.
5. Za $0 \le t < 5$: $c = 50\left(1 - e^{-0{,}2t}\right)$, koncentracija raste.
6. Za $t \ge 5$: $c = 50\left(e^{-0{,}2(t-5)} - e^{-0{,}2t}\right) = 50(e - 1)e^{-0{,}2t}$, koncentracija pada.
7. Največja je ob $t = 5$: $c_{\max} = 50\left(1 - e^{-1}\right) = 31{,}6\,\mathrm{mg/L}$; obe formuli se tam ujemata, $c$ je zvezna.
8. Po $10$ dneh: $c = 50(e - 1)e^{-2} = 11{,}6\,\mathrm{mg/L}$.
9. Odgovor: $c$ raste do $31{,}6\,\mathrm{mg/L}$ ob koncu izpusta, nato eksponentno pojema; po $10$ dneh je $11{,}6\,\mathrm{mg/L}$.

### Naloga 2

Reši $y'' - 2y' + y = 2e^{t}$, $y(0) = 1$, $y'(0) = 0$.

**Rešitev:**

1. Transformiramo: $s^2Y - s - 2(sY - 1) + Y = \frac{2}{s - 1}$.
2. Ker je $s^2 - 2s + 1 = (s - 1)^2$: $Y = \frac{s - 2}{(s - 1)^2} + \frac{2}{(s - 1)^3}$.
3. Števec zapišemo kot $s - 2 = (s - 1) - 1$: $Y = \frac{1}{s - 1} - \frac{1}{(s - 1)^2} + \frac{2}{(s - 1)^3}$.
4. Iz $\mathcal{L}\{t^ne^{t}\} = \frac{n!}{(s - 1)^{n+1}}$: $\frac{1}{(s-1)^2} \mapsto te^t$, $\frac{2}{(s-1)^3} \mapsto t^2e^t$.
5. $y = e^t(1 - t + t^2)$.
6. Preizkus: $y' = e^t(t^2 + t)$, $y'' = e^t(t^2 + 3t + 1)$; $y'' - 2y' + y = 2e^t$, $y(0) = 1$, $y'(0) = 0$.
7. Odgovor: $y = (1 - t + t^2)e^t$. Trojni pol $1$ (dva iz enačbe, eden iz desne strani) da faktor $t^2$; to je resonanca, ki jo pri nastavku rešuje faktor $t^k$.

### Naloga 3

Natančno navedi in dokaži izrek o obstoju Laplaceove transformiranke. Nato utemelji, ali obstaja $\mathcal{L}\{e^{t^2}\}$.

**Rešitev:**

1. Izrek: če je $f$ odsekoma zvezna na $[0, \infty)$ in $|f(t)| \le Me^{at}$ za $t \ge t_0$, potem $\int_0^\infty e^{-st}f\,dt$ absolutno konvergira za vsak $s > a$.
2. Dokaz: na $[0, t_0]$ je odsekoma zvezna funkcija omejena in integrabilna; za $t \ge t_0$ je $|e^{-st}f| \le Me^{-(s-a)t}$ in $\int_{t_0}^\infty Me^{-(s-a)t}\,dt = \frac{M}{s - a}e^{-(s-a)t_0} < \infty$. Po primerjalnem kriteriju integral konvergira.
3. Za $f = e^{t^2}$ in poljuben $s$ je $e^{-st}e^{t^2} = e^{t(t - s)}$.
4. Za $t \ge s + 1$ (in $t \ge 1$) je $t(t - s) \ge t \ge 1$, zato je integrand $\ge e$ na neomejenem intervalu.
5. Integral divergira za vsak $s$.
6. Odgovor: $\mathcal{L}\{e^{t^2}\}$ ne obstaja; funkcija ni eksponentnega reda, pogoj izreka je torej bistven za ta primer (izrek sam daje le zadosten pogoj).

## Drugače: Z analogijo

Pred kalkulatorji so inženirji množili z logaritmi: števili sta »prevedli« v logaritma, ju sešteli (lažje kot množenje) in z antilogaritmom prevedli nazaj. Laplaceova transformacija dela enako na višji ravni. Prevod $f \mapsto F$ spremeni odvajanje v množenje s $s$, diferencialno enačbo pa v algebrsko. V »svetu slik« jo rešiš z ulomki, nato z inverzom (»antilogaritmom«) prebereš rešitev. Tabela slik je tvoja logaritemska tablica. Tako kot logaritem deluje le za pozitivna števila, ima tudi transformacija pogoj: zagotovo deluje za odsekoma zvezne funkcije eksponentnega reda (zadosten pogoj).

## Drugače: Uporaba v stroki

- **Okoljsko inženirstvo.** Jezera, ribniki in reaktorji čistilnih naprav so »škatle« z vtokom in iztokom; razlitje ali izpust je stopnica ali kratek sunek na desni strani. Z $e^{-Ts}$ hkrati obravnavajo začetek in konec izpusta, kot v Nalogi 1.
- **Hidrologija.** Odziv porečja na kratek naliv enotske višine je enotski hidrogram; odtok ob poljubnem dežju je konvolucija padavin s tem odzivom, v sliki pa le produkt.
- **Podnebni modeli s škatlami.** Temperatura oceanske plasti zadošča $C\,T' + \lambda T = F(t)$ s sevalnim vsiljevanjem $F$. Slika pokaže časovno konstanto $\frac{C}{\lambda}$ in odziv na nenaden dvig $\mathrm{CO_2}$.
- **Regulacija.** Razmerje slik izhoda in vhoda je **prenosna funkcija** (naslednja tema); po njenih polih inženirji presodijo, ali bo sistem stabilen in ali bo nihal.

## Drugače: Bolj natančno

**Abscisa konvergence.** Če $F(s_0)$ konvergira, konvergira $F(s)$ za vse $s > s_0$. Zato obstaja $\sigma_c$, da integral konvergira za $s > \sigma_c$ in divergira za $s < \sigma_c$. Za kompleksne $s$ je $F$ holomorfna v polravnini $\operatorname{Re} s > \sigma_c$.

**Konvolucija.** Za $(f * g)(t) = \int_0^t f(\tau)g(t - \tau)\,d\tau$ velja $\mathcal{L}\{f * g\} = F \cdot G$. Primer: $\frac{1}{s^2(s^2+1)}$ je slika $t * \sin t = t - \sin t$.

**Izreka o mejnih vrednostih.** Pod ustreznimi pogoji je $\lim_{s \to \infty} sF(s) = f(0^+)$; če imajo vsi poli $sF(s)$ negativen realni del, je $\lim_{t \to \infty} f(t) = \lim_{s \to 0} sF(s)$. Pri Primeru 2 je $sC(s) \to 50$, kar je končna koncentracija.

**Zveza s Fourierovo transformacijo.** Pri $s = \sigma + i\omega$ je $F(s)$ Fourierova transformiranka funkcije $e^{-\sigma t}f(t)$ (za $t \ge 0$, sicer $0$). Faktor $e^{-\sigma t}$ omogoči transformacijo tudi funkcij, ki rastejo. Formula za inverz je Bromwichev integral $f(t) = \frac{1}{2\pi i}\int_{\sigma - i\infty}^{\sigma + i\infty} e^{st}F(s)\,ds$, ki ga izračunamo z residui; razcep na ulomke je njegova algebrska bližnjica.

## Preveri se

? Katera funkcija **ne** sodi med ostale (vse ostale imajo Laplaceovo transformiranko)?
- $t^5$
~ Polinomi so eksponentnega reda; $\mathcal{L}\{t^5\} = \frac{120}{s^6}$.
- $e^{3t}\cos t$
~ Je eksponentnega reda $3$; slika obstaja za $s > 3$.
+ $e^{t^2}$
- $u(t - 2)$
~ Stopnica je odsekoma zvezna in omejena; slika je $\frac{e^{-2s}}{s}$.
> $e^{t^2}$ raste hitreje od vsake $e^{at}$, zato integral $\int_0^\infty e^{t^2 - st}\,dt$ divergira za vsak $s$.

? Kolikšna je vrednost $f(0)$ originala slike $F(s) = \frac{4}{s + 2} - \frac{1}{s - 3}$?
- $5$
~ Izgubljen je predznak drugega člena: $f(0) = 4 + (-1)$, ne $4 + 1$.
+ $3$
- $-1$
~ Pozabljen je prvi člen $4e^{-2t}$, ki ob $t = 0$ prispeva $4$.
- $\frac{4}{2} + \frac13$
~ To je $F(0) = 2 + \frac13$, ne $f(0)$; vrednost slike pri $s = 0$ ni začetna vrednost originala.
> $f(t) = 4e^{-2t} - e^{3t}$, torej $f(0) = 4 - 1 = 3$.

? Zakaj se pri reševanju $y'' + y = 0$ z Laplaceovo transformacijo konstant ne določa posebej?
- Ker ima enačba enolično rešitev brez začetnih pogojev.
~ Enačba drugega reda ima brez pogojev dvoparametrično družino rešitev.
+ Ker izrek o sliki odvoda vnese $y(0)$ in $y'(0)$ že v enačbo za $Y$.
- Ker inverz vedno da rešitev z $y(0) = 0$.
~ Inverz da tisto rešitev, katere pogoji so bili vstavljeni v $\mathcal{L}\{y''\}$, ne nujno ničelne.
> $\mathcal{L}\{y''\} = s^2Y - sy(0) - y'(0)$; pogoji so del algebrske enačbe, zato je $Y$ in s tem $y$ že določena rešitev.

? Študent rešuje $y' - 3y = 0$, $y(0) = 2$. Kateri korak je napačen? (1) $sY - 2 - 3Y = 0$; (2) $Y = \frac{2}{s - 3}$; (3) $y = 2e^{-3t}$.
- korak (1)
~ Slika odvoda je $sY - y(0) = sY - 2$; korak je pravilen.
- korak (2)
~ Iz $(s - 3)Y = 2$ res sledi $Y = \frac{2}{s - 3}$.
+ korak (3)
- noben korak ni napačen
~ Preizkus: $y = 2e^{-3t}$ da $y' - 3y = -12e^{-3t} \ne 0$.
> Pol je $s = 3$, zato $\frac{2}{s - 3} \mapsto 2e^{3t}$. Napačen je predznak v eksponentu.

? Izpust v jezero traja od $t = 2$ do $t = 6$ dni z jakostjo $q_0$. Katera je slika desne strani $q(t)$?
- $\frac{q_0}{s}\left(e^{-2s} + e^{-6s}\right)$
~ Izklop ob $t = 6$ pomeni odštevanje stopnice, ne prištevanja.
+ $\frac{q_0}{s}\left(e^{-2s} - e^{-6s}\right)$
- $\frac{q_0}{s}\,e^{-4s}$
~ Upoštevano je samo trajanje $4$ dni, ne začetek in konec izpusta.
- $q_0\left(e^{-2s} - e^{-6s}\right)$
~ Manjka slika stopnice $\frac1s$; $e^{-Ts}$ je le zakasnitev.
> $q(t) = q_0\big(u(t - 2) - u(t - 6)\big)$, slika stopnice $u(t - T)$ je $\frac{e^{-Ts}}{s}$.

:::simboli
f | original (funkcija časa) | | | definirana za $t \ge 0$
F | slika (Laplaceova transformiranka) funkcije $f$ | F(s) = \int_0^\infty e^{-st} f(t)\,dt |
g | drugi original | |
G | slika funkcije $g$ | |
s | spremenljivka slike | | | realna, $s > a$
t | čas | | dan | v nalogah z ribnikom
y | iskana rešitev | |
Y | slika rešitve | |
y', y'' | prvi in drugi odvod rešitve | |
a | eksponent v $e^{at}$; red rasti; pol v razcepu | | | $f$ raste največ kot $Me^{at}$
M | konstanta v oceni rasti | |
\omega | krožna frekvenca | | |
\alpha, \beta | koeficienta linearne kombinacije; pri dopolnitvi do kvadrata premik in frekvenca | |
n | naravni eksponent | |
T | zakasnitev | | dan
u | enotska stopnica (Heavisideova funkcija) | | – | pri razcepu tudi $u = s + 1$
A, B, D | koeficienti parcialnih ulomkov | |
P, Q | števec in imenovalec racionalne slike | |
c | koncentracija nitrata v ribniku | | mg/L
C | slika koncentracije | |
c_\mathrm{v} | koncentracija v potoku | | mg/L
k | razmerje pretoka in prostornine | | dan^{-1}
e | Eulerjevo število | | | $e \approx 2{,}718$
d | oznaka diferenciala v integralu ($dt$) | |
b | drugi pol v razcepu na parcialne ulomke | |
:::
