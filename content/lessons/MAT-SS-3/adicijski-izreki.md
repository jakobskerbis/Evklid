---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

**Uganka za začetek.** Na pladnju ležita dva kosa pice. Prvi je iz pice, razrezane na $8$ enakih kosov, zato ima pri konici kot $45^\circ$. Drugi je iz pice, razrezane na $12$ kosov, s kotom $30^\circ$. Položiš ju drugega ob drugega in dobiš izsek s kotom $75^\circ$.

Koliko je $\sin 75^\circ$, če poznaš le vrednosti za $45^\circ$ in $30^\circ$? Prvi namig, ki se ponuja: sešteješ, $\sin 45^\circ + \sin 30^\circ$. Poskusi, preden bereš naprej.

Dobiš $\dfrac{\sqrt{2}}{2} + \dfrac{1}{2} \approx 1{,}207$. To ne more biti res, saj sinus nikoli ne preseže $1$. Sinus vsote torej **ni** vsota sinusov.

Kako se potem »sestavi«? Odgovor dajo **adicijski izreki** (lat. *additio* = seštevanje). Z njimi izračunaš točne vrednosti za kote, ki jih ni v tabeli, poenostaviš zapletene izraze in kasneje rešuješ trigonometrijske enačbe. Pomagajo tudi pri zasukih: v Primeru 3 izračunaš, kam se premakne skodelica na vrtljivem krožniku mikrovalovne pečice.

## Razlaga

**1. Iskanje vzorca.** Vzemimo nekaj parov kotov, pri katerih $\sin(\alpha + \beta)$ poznamo, in preizkusimo dve ideji. Prva je naivna vsota sinusov. Druga je »križni« izraz $\sin\alpha\cos\beta + \cos\alpha\sin\beta$, v katerem se sinus enega kota pomnoži s kosinusom drugega.

| $\alpha + \beta$ | $\sin\alpha + \sin\beta$ | križni izraz | $\sin(\alpha+\beta)$ |
|---|---|---|---|
| $30^\circ + 60^\circ$ | $1{,}366$ | $1$ | $1$ |
| $30^\circ + 30^\circ$ | $1$ | $0{,}866$ | $0{,}866$ |
| $60^\circ + 90^\circ$ | $1{,}866$ | $0{,}5$ | $0{,}5$ |
| $45^\circ + 30^\circ$ | $1{,}207$ | $0{,}966$ | $0{,}966$ |

Vsota sinusov se ne ujema nikjer. Križni izraz se ujema v vsaki vrstici. To ni naključje, temveč pravilo, ki velja za vse kote.

**2. Sinus vsote.** Pravilo se imenuje adicijski izrek za sinus:

$$\sin(\alpha + \beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta$$

Zapomniš si ga kot »sin-kos plus kos-sin«.

:::premisli
Napovej s formulo, koliko je $\sin(90^\circ + \beta)$ za poljuben kot $\beta$. Kateri znani funkciji je enak?
---
$\sin 90^\circ\cos\beta + \cos 90^\circ\sin\beta = 1 \cdot \cos\beta + 0 \cdot \sin\beta = \cos\beta$. Graf sinusa, premaknjen za $90^\circ$ v levo, je ravno graf kosinusa.
:::

**3. Kosinus vsote.** Pri kosinusu se v vsakem produktu množita enaki funkciji (kosinus s kosinusom, sinus s sinusom), med členoma pa je **minus**:

$$\cos(\alpha + \beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta$$

Preizkus z $\alpha = 30^\circ$, $\beta = 60^\circ$: $\cos 30^\circ \cos 60^\circ - \sin 30^\circ \sin 60^\circ = \dfrac{\sqrt{3}}{4} - \dfrac{\sqrt{3}}{4} = 0$, in res je $\cos 90^\circ = 0$. S plusom bi dobili $\dfrac{\sqrt{3}}{2} \approx 0{,}866$, kar je napačno.

**4. Razlika kotov.** Točka na enotski krožnici za kot $-\beta$ je zrcalna slika točke za $\beta$ čez os $x$. Zato je $\cos(-\beta) = \cos\beta$ in $\sin(-\beta) = -\sin\beta$. Ko v obe formuli vstavimo $-\beta$, se obrnejo le predznaki med členoma:

$$\sin(\alpha - \beta) = \sin\alpha\cos\beta - \cos\alpha\sin\beta$$

$$\cos(\alpha - \beta) = \cos\alpha\cos\beta + \sin\alpha\sin\beta$$

Iz $\tan = \dfrac{\sin}{\cos}$ sledi še izrek za tangens. V ulomku $\dfrac{\sin(\alpha \pm \beta)}{\cos(\alpha \pm \beta)}$ razpišemo števec in imenovalec ter oba delimo s $\cos\alpha\cos\beta$:

$$\tan(\alpha \pm \beta) = \frac{\tan\alpha \pm \tan\beta}{1 \mp \tan\alpha\tan\beta}$$

Zgornji znaki veljajo za vsoto, spodnji za razliko.

V simulaciji spodaj (»Adicijski izreki«) nastavi $\alpha = 45^\circ$ in $\beta = 30^\circ$. Opazuj, kako se produkta seštejeta v $\sin 75^\circ$ in da se rezultat ujema s koordinato točke na krožnici. Nato nastavi $\beta$ enako $\alpha$: pod formulami se pokažeta izraza za dvojni kot.

**5. Dvojni kot.** Če je $\beta = \alpha$, iz vsote dobimo **dvojni kot** $2\alpha$:

$$\sin 2\alpha = 2\sin\alpha\cos\alpha$$

$$\cos 2\alpha = \cos^2\alpha - \sin^2\alpha$$

Z zvezo $\sin^2\alpha + \cos^2\alpha = 1$ ima kosinus dvojnega kota še dve obliki. Izbereš tisto, ki vsebuje funkcijo, ki jo poznaš:

$$\cos 2\alpha = 1 - 2\sin^2\alpha = 2\cos^2\alpha - 1$$

Za tangens velja $\tan 2\alpha = \dfrac{2\tan\alpha}{1 - \tan^2\alpha}$.

:::premisli
Za $\alpha = 60^\circ$ je $2\sin\alpha \approx 1{,}732$, $\sin 120^\circ$ pa le $0{,}866$. Zakaj je $\sin 2\alpha$ za ostre kote vedno manjši od $2\sin\alpha$?
---
Ker je $\sin 2\alpha = 2\sin\alpha \cdot \cos\alpha$ in je za ostri kot $0 < \cos\alpha < 1$. Množenje s številom, manjšim od $1$, zmanjša pozitivno vrednost. Enakost bi veljala le pri $\cos\alpha = 1$ ali $\sin\alpha = 0$.
:::

**6. Preoblikovanje izrazov.** Izreki delujejo v obe smeri. Izraz $2\sin x\cos x$ lahko zapišeš krajše kot $\sin 2x$, izraz $\cos^2 x - \sin^2 x$ pa kot $\cos 2x$. Pri poenostavljanju iščeš prav takšne vzorce in jih zamenjaš s krajšim zapisom.

## Rešeni primeri

### Primer 1 (lažji): točna vrednost

Izračunaj točno vrednost $\cos 15^\circ$.

**Podatki:** kot $15^\circ = 45^\circ - 30^\circ$; znane vrednosti $\sin 45^\circ = \cos 45^\circ = \dfrac{\sqrt{2}}{2}$, $\sin 30^\circ = \dfrac{1}{2}$, $\cos 30^\circ = \dfrac{\sqrt{3}}{2}$
**Iščemo:** $\cos 15^\circ$

:::formula
$\cos(\alpha - \beta) = \cos\alpha\cos\beta + \sin\alpha\sin\beta$
:::

**Rešitev:**

1. Kot razstavimo na kota iz tabele: $15^\circ = 45^\circ - 30^\circ$.
2. Vstavimo: $\cos 15^\circ = \dfrac{\sqrt{2}}{2} \cdot \dfrac{\sqrt{3}}{2} + \dfrac{\sqrt{2}}{2} \cdot \dfrac{1}{2}$. Pri razliki je pri kosinusu plus.
3. Zmnožimo: $\cos 15^\circ = \dfrac{\sqrt{6}}{4} + \dfrac{\sqrt{2}}{4} = \dfrac{\sqrt{6} + \sqrt{2}}{4}$.
4. Preverba s kalkulatorjem: $\dfrac{\sqrt{6} + \sqrt{2}}{4} \approx 0{,}966$, kar je enako $\cos 15^\circ$.
5. Odgovor: $\cos 15^\circ = \dfrac{\sqrt{6} + \sqrt{2}}{4} \approx 0{,}966$. Je enak $\sin 75^\circ$ iz uganke, saj se kota dopolnjujeta do $90^\circ$ in velja $\cos x = \sin(90^\circ - x)$.

### Primer 2: dvojni kot

Za kot $\alpha$ v drugem kvadrantu ($90^\circ < \alpha < 180^\circ$) velja $\sin\alpha = \dfrac{3}{5}$. Izračunaj $\sin 2\alpha$ in $\cos 2\alpha$.

**Podatki:** $\sin\alpha = \dfrac{3}{5}$, $90^\circ < \alpha < 180^\circ$
**Iščemo:** $\sin 2\alpha$, $\cos 2\alpha$

:::formula
$\sin 2\alpha = 2\sin\alpha\cos\alpha$, $\quad \cos 2\alpha = 1 - 2\sin^2\alpha$, $\quad \cos\alpha = \pm\sqrt{1 - \sin^2\alpha}$
:::

**Rešitev:**

1. Najprej kosinus: $\cos^2\alpha = 1 - \dfrac{9}{25} = \dfrac{16}{25}$, torej $|\cos\alpha| = \dfrac{4}{5}$.
2. V drugem kvadrantu je kosinus negativen, zato $\cos\alpha = -\dfrac{4}{5}$.
3. $\sin 2\alpha = 2 \cdot \dfrac{3}{5} \cdot \left(-\dfrac{4}{5}\right) = -\dfrac{24}{25} = -0{,}96$.
4. Za $\cos 2\alpha$ vzamemo obliko s sinusom, ker je sinus dan: $\cos 2\alpha = 1 - 2 \cdot \dfrac{9}{25} = \dfrac{7}{25} = 0{,}28$.
5. Preverba: $\sin^2 2\alpha + \cos^2 2\alpha = \dfrac{576}{625} + \dfrac{49}{625} = 1$. ✓
6. Odgovor: $\sin 2\alpha = -0{,}96$ in $\cos 2\alpha = 0{,}28$. Kot $2\alpha$ leži v četrtem kvadrantu.

### Primer 3 (težji): krožnik v mikrovalovni pečici

Skodelica stoji na vrtljivem krožniku mikrovalovne pečice, $12\,\text{cm}$ od središča. Središče je izhodišče koordinatnega sistema. Na začetku je skodelica v točki $(9{,}6\,\text{cm};\ 7{,}2\,\text{cm})$. Krožnik se zavrti za $30^\circ$ v pozitivni smeri. Kje je skodelica zdaj?

**Podatki:** polmer $r = 12\,\text{cm}$, začetna lega $x_0 = 9{,}6\,\text{cm}$, $y_0 = 7{,}2\,\text{cm}$, zasuk $\beta = 30^\circ$
**Iščemo:** novi koordinati $x$ in $y$

:::formula
Točka na krožnici s polmerom $r$ pri kotu $\varphi$: $(r\cos\varphi,\ r\sin\varphi)$. Po zasuku je kot $\alpha + \beta$, zato

$x = r(\cos\alpha\cos\beta - \sin\alpha\sin\beta)$

$y = r(\sin\alpha\cos\beta + \cos\alpha\sin\beta)$
:::

**Rešitev:**

1. Kota $\alpha$ ne potrebujemo, le njegov sinus in kosinus. Koordinati delimo s polmerom: $\cos\alpha = \dfrac{9{,}6}{12} = 0{,}8$, $\sin\alpha = \dfrac{7{,}2}{12} = 0{,}6$.
2. Kosinus vsote: $\cos(\alpha + 30^\circ) = 0{,}8 \cdot \dfrac{\sqrt{3}}{2} - 0{,}6 \cdot \dfrac{1}{2} \approx 0{,}6928 - 0{,}3 = 0{,}3928$.
3. Sinus vsote: $\sin(\alpha + 30^\circ) = 0{,}6 \cdot \dfrac{\sqrt{3}}{2} + 0{,}8 \cdot \dfrac{1}{2} \approx 0{,}5196 + 0{,}4 = 0{,}9196$.
4. Pomnožimo s polmerom: $x \approx 12\,\text{cm} \cdot 0{,}3928 \approx 4{,}71\,\text{cm}$, $y \approx 12\,\text{cm} \cdot 0{,}9196 \approx 11{,}04\,\text{cm}$.
5. Preverba: razdalja od središča mora ostati $12\,\text{cm}$. Res je $\sqrt{4{,}71^2 + 11{,}04^2} \approx 12{,}0$.
6. Odgovor: skodelica je po zasuku v točki približno $(4{,}71\,\text{cm};\ 11{,}04\,\text{cm})$.

### Primer 4 – zdaj ti: poenostavi izraz

Poenostavi izraz $\dfrac{\sin 2\alpha}{1 + \cos 2\alpha}$ (za kote, pri katerih imenovalec ni $0$).

**Podatki:** izraz $\dfrac{\sin 2\alpha}{1 + \cos 2\alpha}$
**Iščemo:** krajši zapis izraza

:::formula
$\sin 2\alpha = 2\sin\alpha\cos\alpha$, $\quad \cos 2\alpha = 2\cos^2\alpha - 1$
:::

**Rešitev:**

1. V imenovalcu izberemo obliko $2\cos^2\alpha - 1$, da se enici izničita: $1 + \cos 2\alpha = 1 + 2\cos^2\alpha - 1 = 2\cos^2\alpha$.
2. Števec zapišemo kot $2\sin\alpha\cos\alpha$.
3. Okrajšaj ulomek sam, nato preveri:

:::premisli
Kaj ostane od $\dfrac{2\sin\alpha\cos\alpha}{2\cos^2\alpha}$?
---
Krajšamo $2\cos\alpha$ in ostane $\dfrac{\sin\alpha}{\cos\alpha} = \tan\alpha$. Preizkus z $\alpha = 30^\circ$: $\dfrac{\sin 60^\circ}{1 + \cos 60^\circ} = \dfrac{0{,}866}{1{,}5} \approx 0{,}577 = \tan 30^\circ$.
:::

## Pogoste napake

- **»Sinus vsote je vsota sinusov.«** Zapis $\sin(\alpha + \beta) = \sin\alpha + \sin\beta$ je videti kot razčlenjevanje oklepaja. Sinus pa ni množenje s številom, zato oklepaja ne smeš »razčleniti«. Že $\sin 45^\circ + \sin 30^\circ > 1$ pokaže, da je to nemogoče. Uporabi križni izraz.
- **Napačen predznak pri kosinusu.** Kdor si zapomni, da je pri sinusu vsote plus, rad napiše plus tudi pri kosinusu. Pri kosinusu je predznak ravno obrnjen: pri vsoti minus, pri razliki plus. Preveri s $\cos(30^\circ + 60^\circ) = 0$.
- **$\sin 2\alpha = 2\sin\alpha$.** Dvojka pred kotom ni dvojka pred funkcijo. Pravilno je $2\sin\alpha\cos\alpha$, kar je za ostre kote vedno manj kot $2\sin\alpha$.
- **$\cos 2\alpha = \cos^2\alpha + \sin^2\alpha$.** Ta izraz je vedno $1$, zato ne more biti $\cos 2\alpha$. Med kvadratoma je minus.
- **Predznak pozabljen pri korenjenju.** Iz $\sin\alpha$ dobiš $|\cos\alpha|$, predznak pa določi kvadrant. V Primeru 2 bi s $\cos\alpha = +\frac{4}{5}$ dobil $\sin 2\alpha = +0{,}96$, kar je napačno.

## Povzetek

- $\sin(\alpha \pm \beta) = \sin\alpha\cos\beta \pm \cos\alpha\sin\beta$
- $\cos(\alpha \pm \beta) = \cos\alpha\cos\beta \mp \sin\alpha\sin\beta$ (predznak se obrne)
- $\tan(\alpha \pm \beta) = \dfrac{\tan\alpha \pm \tan\beta}{1 \mp \tan\alpha\tan\beta}$
- Dvojni kot: $\sin 2\alpha = 2\sin\alpha\cos\alpha$, $\cos 2\alpha = \cos^2\alpha - \sin^2\alpha = 1 - 2\sin^2\alpha = 2\cos^2\alpha - 1$.
- $\sin(\alpha + \beta) \neq \sin\alpha + \sin\beta$ in $\sin 2\alpha \neq 2\sin\alpha$.
- Izreki veljajo v obe smeri: z njimi razstaviš kot ali pa izraz zložiš v krajši zapis.

## Drugače: Korak za korakom s številkami

Izračunajmo $\sin 105^\circ$ brez kalkulatorja.

1. Razstavi kot na kota iz tabele: $105^\circ = 60^\circ + 45^\circ$.
2. Izpiši vrednosti: $\sin 60^\circ = \frac{\sqrt{3}}{2}$, $\cos 60^\circ = \frac{1}{2}$, $\sin 45^\circ = \cos 45^\circ = \frac{\sqrt{2}}{2}$.
3. Izberi izrek: vsota, sinus, torej »sin-kos plus kos-sin«.
4. Vstavi: $\frac{\sqrt{3}}{2} \cdot \frac{\sqrt{2}}{2} + \frac{1}{2} \cdot \frac{\sqrt{2}}{2} = \frac{\sqrt{6} + \sqrt{2}}{4}$.
5. Preveri smiselnost: $\frac{\sqrt{6} + \sqrt{2}}{4} \approx 0{,}966$. To je enako kot $\sin 75^\circ$, kar se ujema, saj je $\sin(180^\circ - x) = \sin x$.

Še preizkus treh oblik za $\cos 2\alpha$ pri $\alpha = 30^\circ$, kjer mora priti $\cos 60^\circ = 0{,}5$:

- $\cos^2 30^\circ - \sin^2 30^\circ = 0{,}75 - 0{,}25 = 0{,}5$
- $1 - 2\sin^2 30^\circ = 1 - 0{,}5 = 0{,}5$
- $2\cos^2 30^\circ - 1 = 1{,}5 - 1 = 0{,}5$

## Drugače: Kot zgodba

Slaščičarka Tina okrasi torto na vrtljivem podstavku. Na rob torte postavi jagodo in podstavek zavrti za kot $\alpha$. Jagoda je zdaj »$\cos\alpha$ v desno in $\sin\alpha$ navzgor« od središča (če je polmer torte $1$).

Nato podstavek zavrti še za $\beta$. Vajenec Luka pravi: »Višina je zdaj $\sin\alpha + \sin\beta$.« Tina se nasmehne: »Potem bi jagoda pri dveh zasukih za $60^\circ$ zletela s torte, na višino $1{,}73$.«

Tina razloži drugače. Premik jagode razdeli na dva dela: »desni del« $\cos\alpha$ in »zgornji del« $\sin\alpha$. Ob drugem zasuku se zavrtita oba dela. Desni del se nagne navzgor in prispeva k višini $\cos\alpha \cdot \sin\beta$. Zgornji del se nagne in od njegove višine ostane $\sin\alpha \cdot \cos\beta$. Skupaj:

višina $= \sin\alpha\cos\beta + \cos\alpha\sin\beta$.

Luka preveri z $\alpha = \beta = 60^\circ$: $2 \cdot \frac{\sqrt{3}}{2} \cdot \frac{1}{2} \approx 0{,}866 = \sin 120^\circ$. Jagoda ostane na torti.

## Preveri se

? Katera enakost velja za vse kote $\alpha$ in $\beta$?
- $\sin(\alpha + \beta) = \sin\alpha + \sin\beta$
~ Sinus ni množenje s številom, oklepaja ne smeš razčleniti. Za $45^\circ$ in $30^\circ$ bi dobil več kot $1$.
+ $\cos(\alpha + \beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta$
- $\cos(\alpha - \beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta$
~ Pri kosinusu se predznak obrne: pri razliki je plus. Preveri z $\alpha = \beta$: dobiti moraš $\cos 0^\circ = 1$.
- $\sin 2\alpha = 2\sin\alpha$
~ Dvojka pred kotom ni dvojka pred funkcijo: $\sin 2\alpha = 2\sin\alpha\cos\alpha$.
> Pri kosinusu vsote ostaneta skupaj enaki funkciji, med členoma je minus. Preizkus: $\cos(30^\circ + 60^\circ) = 0$.

? Za kot $\alpha$ velja $\sin\alpha = 0{,}6$ in $\cos\alpha = 0{,}8$. Koliko je $\sin 2\alpha$?
- $1{,}2$
~ To je $2\sin\alpha$. Pozabil si na faktor $\cos\alpha$.
- $0{,}48$
~ To je le $\sin\alpha\cos\alpha$, manjka dvojka.
+ $0{,}96$
- $0{,}28$
~ To je $\cos 2\alpha = 0{,}64 - 0{,}36$, ne sinus dvojnega kota.
> $\sin 2\alpha = 2 \cdot 0{,}6 \cdot 0{,}8 = 0{,}96$.

? Nina računa $\cos 75^\circ$. (1) $75^\circ = 45^\circ + 30^\circ$. (2) $\cos 75^\circ = \cos 45^\circ\cos 30^\circ + \sin 45^\circ\sin 30^\circ$. (3) Rezultat: $\dfrac{\sqrt{6} + \sqrt{2}}{4} \approx 0{,}966$. Kje je napaka?
- V koraku 1.
~ Razstavitev je pravilna, $45^\circ + 30^\circ$ je res $75^\circ$.
+ V koraku 2.
- V koraku 3.
~ Račun v koraku 3 je pravilen za izraz iz koraka 2. Napaka je nastala prej.
- Nikjer, rešitev je pravilna.
~ Kosinus pada, zato mora biti $\cos 75^\circ$ manjši od $\cos 60^\circ = 0{,}5$. Rezultat $0{,}966$ je prevelik.
> Pri kosinusu vsote je minus: $\cos 75^\circ = \dfrac{\sqrt{6} - \sqrt{2}}{4} \approx 0{,}259$.

? Primerjaj $\sin 2\alpha$ in $2\sin\alpha$ za ostri kot $\alpha$ ($0^\circ < \alpha < 90^\circ$).
+ $\sin 2\alpha$ je vedno manjši.
- Sta enaka.
~ To bi veljalo, če bi bil $\sin 2\alpha = 2\sin\alpha$. Pravilno je $2\sin\alpha\cos\alpha$.
- $\sin 2\alpha$ je vedno večji.
~ Faktor $\cos\alpha$ je za ostri kot manjši od $1$, zato produkt zmanjša.
- Odvisno od kota: včasih je večji eden, včasih drugi.
~ Za vse ostre kote velja $0 < \cos\alpha < 1$, zato je odnos vedno enak.
> $\sin 2\alpha = 2\sin\alpha \cdot \cos\alpha$ in $0 < \cos\alpha < 1$, zato je $\sin 2\alpha < 2\sin\alpha$.

? Skodelica je na krožniku mikrovalovne pečice v točki $(10\,\text{cm};\ 0)$. Krožnik se zavrti za $45^\circ$ in nato še za $30^\circ$ v pozitivni smeri. Kolikšna je zdaj koordinata $y$ skodelice?
- $12{,}07\,\text{cm}$
~ To je $10\,\text{cm} \cdot (\sin 45^\circ + \sin 30^\circ)$. Koordinata $y$ bi bila večja od razdalje skodelice od središča ($10\,\text{cm}$), kar ni mogoče.
+ $9{,}66\,\text{cm}$
- $2{,}59\,\text{cm}$
~ To je $10\,\text{cm} \cdot \sin 15^\circ$. Kota zasukov se seštejeta, ne odštejeta.
> Skupni zasuk je $75^\circ$, zato $y = 10\,\text{cm} \cdot \sin 75^\circ = 10\,\text{cm} \cdot \dfrac{\sqrt{6} + \sqrt{2}}{4} \approx 9{,}66\,\text{cm}$.

:::simboli
\alpha | prvi kot (začetni kot) | |
\beta | drugi kot (zasuk) | |
r | polmer krožnika (razdalja skodelice od središča) | | cm
\varphi | kot točke na krožnici | |
x | koordinata $x$ skodelice po zasuku | x = r\cos(\alpha + \beta) | cm
y | koordinata $y$ skodelice po zasuku | y = r\sin(\alpha + \beta) | cm
:::
