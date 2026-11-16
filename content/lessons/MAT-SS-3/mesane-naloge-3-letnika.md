---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Imaš kvadratno pločevino s stranico $30\,\mathrm{cm}$. V vseh štirih vogalih izrežeš enake kvadratke s stranico $x$ in robove zapogneš navzgor. Dobiš pekač brez pokrova. Recept za biskvit zahteva pekač, v katerega gre natanko $1\,\mathrm{L}$ testa, torej $1000\,\mathrm{cm^3}$. Kolikšne kvadratke moraš izrezati?

Vprašanje je iz kuhinje, odgovor pa iz treh poglavij 3. letnika. Prostornina kvadra je geometrija teles. Iz nje nastane polinom tretje stopnje. Na koncu geometrija pove, katere ničle polinoma sploh pridejo v poštev. Na maturi so take verige pogoste: besedilo omeni pekač, krožnico ali trikotnik, račun pa teče skozi več poglavij.

## Razlaga

**Poskusi nekaj vrednosti.** Pekač ima višino $x$, dno pa je kvadrat s stranico $a = 30 - 2x$ (z vsake strani odrežeš $x$). Izračunajmo prostornino za nekaj izbir:

| $x$ [cm] | $a$ [cm] | $V$ [$\mathrm{cm^3}$] |
|---|---|---|
| $1$ | $28$ | $784$ |
| $2$ | $26$ | $1352$ |
| $5$ | $20$ | $2000$ |
| $10$ | $10$ | $1000$ |
| $14$ | $2$ | $56$ |

Kaj opaziš? Prostornina najprej raste, nato pada. V tabeli vrednost $1000$ dosežemo pri $x = 10$. Ker je pri $x = 1$ prostornina pod $1000$, pri $x = 2$ pa nad, je med njima še ena rešitev. Odgovora sta torej vsaj dva: plitev širok pekač in globok ozek pekač.

:::premisli
Ali lahko izrežeš kvadratke s stranico $15\,\mathrm{cm}$ ali več? Kaj to pomeni za rešitve enačbe, ki jo bomo zapisali?
---
Ne. Pri $x = 15$ je stranica dna $30 - 30 = 0$, pri večjem $x$ bi bila negativna. Zato pride v poštev le $0 < x < 15$. Enačba lahko ima tudi rešitev zunaj tega intervala, a te pekač ne more imeti.
:::

**Iz tabele v enačbo.** Splošno je prostornina $V(x) = x(30 - 2x)^2$ za $0 < x < 15$. Pogoj $V(x) = 1000$ je enačba tretje stopnje. Ko izraz zmnožimo in vse prenesemo na levo, dobimo $4x^3 - 120x^2 + 900x - 1000 = 0$. Delimo s $4$ in dobimo

$$x^3 - 30x^2 + 225x - 250 = 0$$

Rešitev $x = 10$ že poznamo iz tabele, zato polinom delimo z $x - 10$ (Hornerjev algoritem) in dobimo kvadratni faktor. To dokončaš v Primeru 4.

**Drugi poskus: premica in krožnica.** Krožnica $x^2 + y^2 = 8$ ima središče v izhodišču in polmer $2\sqrt{2}$. Premica $y = x + n$ jo lahko seka, se je dotika ali gre mimo. Vstavimo $y$ v enačbo krožnice, $x^2 + (x + n)^2 = 8$, in uredimo:

$$2x^2 + 2nx + n^2 - 8 = 0$$

Diskriminanta je $D = 4n^2 - 8(n^2 - 8) = 64 - 4n^2$. Poglejmo tri primere:

| $n$ | $D$ | rešitev $x$ | lega |
|---|---|---|---|
| $2$ | $48$ | dve | seka |
| $4$ | $0$ | ena | dotika se |
| $6$ | $-80$ | nobene | mimo |

**Pravilo, ki ga vidiš v obeh poskusih:** geometrijsko vprašanje prevedeš v enačbo. Število rešitev enačbe je število skupnih točk, vsaka rešitev je ena točka. Pri kvadratni enačbi število rešitev pove diskriminanta: $D > 0$ dve presečišči, $D = 0$ dotikališče (premica je tangenta), $D < 0$ nobene skupne točke. Geometrija nato izloči rešitve, ki ne ustrezajo (pri pekaču $x \ge 15$).

:::premisli
Pri $n = 4$ je $D = 0$. Napovej, kje se premica dotika krožnice, preden računaš. Namig: kakšen kot oklepa tangenta s polmerom?
---
Tangenta je pravokotna na polmer v dotikališču. Polmer leži na premici $y = -x$ skozi središče, ki je pravokotna na $y = x + 4$. Iz $-x = x + 4$ dobiš $x = -2$ in $y = 2$, točka $(-2, 2)$. Račun potrdi: pri $D = 0$ je $x = -\frac{2n}{4} = -2$.
:::

Pri vsaki mešani nalogi se postopek ponovi: poišči, kaj je neznanka, in zapiši omejitve; prevedi besede v enačbo ali vektor; reši z orodjem tistega poglavja; z omejitvami izberi smiselne rešitve. Katero orodje kliče besedilo, pove ta seznam za snov 3. letnika (v besedilu piše → orodje in zapis):

- »kot med vektorjema« → skalarni produkt, $\cos\varphi = \frac{\vec a \cdot \vec b}{\lvert\vec a\rvert\,\lvert\vec b\rvert}$
- »pravokotna« → skalarni produkt $\vec a \cdot \vec b = 0$
- »nasproti kota« → kosinusni ali sinusni izrek
- »očrtani krog« → sinusni izrek, $\frac{a}{\sin\alpha} = 2R$
- »se dotika«, »tangenta« → diskriminanta, pogoj $D = 0$
- »presečišča krivulj« → sistem, nato enačba $f(x) = g(x)$
- »kje je pozitivna« → ničle, poli, tabela predznakov
- »koliko gre noter« → prostornina, $V = S v$ ali $\frac{S v}{3}$

V simulaciji spodaj (Zbirka simulacij za maturo) odpri Kotne funkcije in povleci kot čez $90^\circ$. Opazi, da kosinus postane negativen: zato negativen skalarni produkt dveh vektorjev pomeni top kot med njima.

## Rešeni primeri

### Primer 1 (lažji): kot in ploščina iz koordinat

Trikotnik ima oglišča $A(0, 0)$, $B(4, 0)$ in $C(2, 2)$. Izračunaj kot $\alpha$ pri oglišču $A$ in ploščino trikotnika. (vektorji + kotne funkcije + ploščina trikotnika)

**Podatki:** $A(0, 0)$, $B(4, 0)$, $C(2, 2)$
**Iščemo:** kot $\alpha$ in ploščino $S$

:::formula
$\cos\alpha = \dfrac{\vec{AB} \cdot \vec{AC}}{|\vec{AB}|\,|\vec{AC}|}$, $\;S = \dfrac{1}{2}\,|\vec{AB}|\,|\vec{AC}|\sin\alpha$
:::

**Rešitev:**

1. Vektorja iz oglišča $A$: $\vec{AB} = (4, 0)$, $\vec{AC} = (2, 2)$.
2. Skalarni produkt: $4 \cdot 2 + 0 \cdot 2 = 8$.
3. Dolžini: $|\vec{AB}| = 4$, $|\vec{AC}| = \sqrt{8} = 2\sqrt{2}$.
4. $\cos\alpha = \frac{8}{4 \cdot 2\sqrt{2}} = \frac{\sqrt{2}}{2}$, zato $\alpha = 45^\circ$ (poseben kot, računalo ni potrebno).
5. Ploščina: $S = \frac{1}{2} \cdot 4 \cdot 2\sqrt{2} \cdot \frac{\sqrt{2}}{2} = 4$.
6. Smisel: osnovnica $AB$ meri $4$, višina iz $C$ je $2$, in $\frac{4 \cdot 2}{2} = 4$.
7. Odgovor: kot pri $A$ meri $45^\circ$, ploščina trikotnika je $4$ kvadratne enote.

### Primer 2 (višja raven): kje je graf nad premico

Za katere $x$ leži graf funkcije $f(x) = \dfrac{x + 6}{x}$ nad premico $y = x$? (racionalne funkcije + racionalne neenačbe + polinomi)

**Podatki:** $f(x) = \dfrac{x + 6}{x}$, premica $y = x$
**Iščemo:** množico vseh $x$, za katere je $f(x) > x$

:::formula
neenačba $\dfrac{x + 6}{x} - x > 0$, skupni imenovalec, ničle in poli, tabela predznakov
:::

**Rešitev:**

1. Vse prenesemo na levo, da je na desni $0$: $\frac{x + 6 - x^2}{x} > 0$. Z imenovalcem ne množimo, ker ne vemo, ali je pozitiven.
2. Števec razstavimo: $-x^2 + x + 6 = -(x - 3)(x + 2)$. Ničli sta $-2$ in $3$, pol je $0$.
3. Predznak preverimo na vsakem intervalu s poskusno točko. Pri $x = -3$ je izraz $2 > 0$, pri $x = -1$ je $-4 < 0$, pri $x = 1$ je $6 > 0$, pri $x = 4$ je $-1{,}5 < 0$.
4. Ničli $-2$ in $3$ nista rešitvi, ker je neenačba stroga (»$>$«, ne »$\ge$«); tam se graf in premica sekata v $(-2, -2)$ in $(3, 3)$.
5. Odgovor: graf je nad premico za $x \in (-\infty, -2) \cup (0, 3)$.

### Primer 3 (težji): kozarec za koktajl

Kozarec ima obliko stožca s konico navzdol: polmer roba je $4\,\mathrm{cm}$, globina $12\,\mathrm{cm}$. Do katere višine nad konico moraš natočiti sok, da bo kozarec napolnjen do polovice prostornine? Rezultat zaokroži na milimeter. (podobnost + prostornina stožca + koren tretje stopnje)

**Podatki:** $r = 4\,\mathrm{cm}$, $v = 12\,\mathrm{cm}$; sok zavzame polovico prostornine
**Iščemo:** višino gladine $h$

:::formula
$V = \dfrac{\pi r^2 v}{3}$; sok tvori podoben stožec s polmerom gladine $\rho$: $\dfrac{\rho}{h} = \dfrac{r}{v}$
:::

**Rešitev:**

1. Prostornina kozarca: $V = \frac{\pi \cdot 16 \cdot 12}{3} = 64\pi \approx 201{,}1\,\mathrm{cm^3}$. Polovica je $32\pi\,\mathrm{cm^3}$.
2. Sok v kozarcu je manjši stožec, podoben celemu. Polmer gladine $\rho$ je zato v istem razmerju: $\rho = \frac{4}{12}h = \frac{h}{3}$.
3. Prostornina soka: $V_s = \frac{\pi}{3} \cdot \frac{h^2}{9} \cdot h = \frac{\pi h^3}{27}$.
4. Enačba $\frac{\pi h^3}{27} = 32\pi$ da $h^3 = 864$.
5. $h = \sqrt[3]{864} \approx 9{,}52\,\mathrm{cm}$.
6. Smisel: polovica višine bi dala le $\left(\frac{1}{2}\right)^3 = \frac{1}{8}$ prostornine, ker se pri podobnih telesih prostornina spremeni s kubom koeficienta. Zato mora biti gladina precej više od $6\,\mathrm{cm}$.
7. Odgovor: sok natočiš do višine približno $9{,}5\,\mathrm{cm}$ nad konico.

### Primer 4 – zdaj ti: pekač do konca

Dokončaj nalogo iz uvoda: reši enačbo $x^3 - 30x^2 + 225x - 250 = 0$ pri pogoju $0 < x < 15$. Rezultat zaokroži na milimeter. (telesa + polinomi + kvadratna enačba)

**Podatki:** pločevina $30\,\mathrm{cm} \times 30\,\mathrm{cm}$, $V = 1000\,\mathrm{cm^3}$, ena rešitev $x = 10$
**Iščemo:** vse smiselne stranice kvadratkov $x$

:::formula
Hornerjev algoritem za $x = 10$; $\;x_{1,2} = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
:::

**Rešitev:**

1. Hornerjev algoritem s koeficienti $1$, $-30$, $225$, $-250$ pri $x = 10$ da $1$, $-20$, $25$ in ostanek $0$.
2. Zato je $x^3 - 30x^2 + 225x - 250 = (x - 10)(x^2 - 20x + 25)$.
3. Reši kvadratno enačbo $x^2 - 20x + 25 = 0$ sam in s pogojem $0 < x < 15$ izberi rešitve.

:::premisli
Katere stranice kvadratkov dajo pekač z $1\,\mathrm{L}$ prostornine?
---
$x = \frac{20 \pm \sqrt{400 - 100}}{2} = 10 \pm 5\sqrt{3}$, torej $x \approx 1{,}34\,\mathrm{cm}$ ali $x \approx 18{,}66\,\mathrm{cm}$. Druga je večja od $15$, zato odpade. Odgovor: izrežeš kvadratke s stranico $10\,\mathrm{cm}$ (globok pekač) ali približno $1{,}3\,\mathrm{cm}$ (plitev pekač).
:::

## Pogoste napake

- **Kosinus brez dolžin.** Nekdo zapiše $\cos\alpha = \vec a \cdot \vec b$ in dobi »kosinus« $8$. Skalarni produkt moraš deliti s produktom dolžin; kosinus je vedno med $-1$ in $1$.
- **Računalo v napačnem načinu.** V radianih da $\cos^{-1}\frac{1}{\sqrt{3}}$ vrednost $0{,}96$, v stopinjah $54{,}74^\circ$. Pred računanjem preveri, kaj naloga zahteva.
- **Rešitev, ki je geometrija ne dopušča.** Polinom pekača ima ničlo $18{,}66$, a pekač s tako stranico kvadratka ne obstaja. Omejitve zapiši na začetku in jih uporabi na koncu.
- (višja raven) **Množenje neenačbe z imenovalcem.** Iz $\frac{x + 6}{x} > x$ z množenjem z $x$ dobiš $x + 6 > x^2$, kar velja le za $x > 0$. Dobiš $(-2, 3)$: izgubiš interval $(-\infty, -2)$ in po pomoti dodaš $(-2, 0)$. Vse prenesi na eno stran in uporabi tabelo predznakov.
- **»Pol višine, pol prostornine.«** Pri podobnih telesih se dolžine pomnožijo s $k$, ploščine s $k^2$, prostornine s $k^3$. Stožec, napolnjen do polovice višine, je poln le do osmine.

## Povzetek

- Mešana naloga je veriga: neznanka in omejitve, prevod v enačbo ali vektor, račun po poglavjih, izbor rešitev z omejitvami.
- Število rešitev sistema je število skupnih točk krivulj; pri kvadratni enačbi ga pove diskriminanta, $D = 0$ pomeni tangento.
- Kot med vektorjema: $\cos\varphi = \frac{\vec a \cdot \vec b}{|\vec a|\,|\vec b|}$; pravokotnost: $\vec a \cdot \vec b = 0$.
- Ploščina trikotnika iz dveh stranic in vmesnega kota: $S = \frac{1}{2}ab\sin\gamma$.
- (višja raven) Racionalna neenačba: vse na eno stran, ničle in poli, tabela predznakov; z imenovalcem ne množi.
- Polinom tretje stopnje z znano ničlo $x_0$ deliš z $x - x_0$ (Horner) in rešiš kvadratni faktor.
- Podobna telesa: prostornina se spremeni s $k^3$.

## Ponovitev

**Formule**
- $\cos\varphi = \frac{\vec a \cdot \vec b}{|\vec a|\,|\vec b|}$ (na pamet)
- Pravokotnost: $\vec a \cdot \vec b = 0$ (na pamet)
- $S = \frac{1}{2}ab\sin\gamma$ (na pamet)
- Tangenta: diskriminanta $D = 0$ (na pamet)
- Podobna telesa: ploščine s $k^2$, prostornine s $k^3$ (na pamet)

**Postopek**
1. Določi neznanko in zapiši omejitve, na primer $0 < x < 15$.
2. Besedilo prevedi v enačbo, sistem ali vektor.
3. Izberi orodje: »pravokotna« da skalarni produkt, »tangenta« $D = 0$.
4. Reši; pri polinomu z znano ničlo $x_0$ deli z $x - x_0$.
5. Z omejitvami izberi smiselne rešitve in zapiši odgovor.

**Pazi na**
- Skalarni produkt deli s produktom dolžin; kosinus je med $-1$ in $1$.
- Omejitve uporabi na koncu: ničla $18{,}66$ za pekač ne pride v poštev.
- Stožec, napolnjen do polovice višine, je poln le do osmine ($k^3$).

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

V trikotniku je stranica $a = 6\,\mathrm{cm}$, kot nasproti nje pa $\alpha = 30^\circ$. Izračunajte polmer trikotniku očrtanega kroga in ploščino tega kroga. (sinusni izrek + ploščina kroga)

**Rešitev:**

1. Po sinusnem izreku je $\frac{a}{\sin\alpha} = 2R$, torej $2R = \frac{6}{1/2} = 12\,\mathrm{cm}$.
2. $R = 6\,\mathrm{cm}$.
3. Ploščina kroga: $\pi R^2 = 36\pi\,\mathrm{cm^2}$.
4. Odgovor: polmer očrtanega kroga je $6\,\mathrm{cm}$, ploščina kroga je $36\pi\,\mathrm{cm^2}$.

**Točkovanje:** 1 točka za zapis sinusnega izreka z $2R$, 1 točka za $R = 6\,\mathrm{cm}$, 1 točka za ploščino $36\pi\,\mathrm{cm^2}$.

### Naloga 2: krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Dan je polinom $p(x) = 2x^3 - x^2 - 2x + 1$. (polinomi + polinomska neenačba + trigonometrijska enačba)

a) Razstavite polinom in zapišite njegove ničle. (2 točki)

b) Rešite neenačbo $p(x) < 0$. (2 točki)

c) Rešite enačbo $p(\cos x) = 0$ na intervalu $[0, 2\pi)$. (3 točke)

**Rešitev:**

1. a) Združimo člene: $x^2(2x - 1) - (2x - 1) = (2x - 1)(x^2 - 1) = (2x - 1)(x - 1)(x + 1)$.
2. a) Ničle so $-1$, $\frac{1}{2}$ in $1$, vse enostavne.
3. b) Vodilni koeficient je pozitiven, zato je $p$ za velike $x$ pozitiven in pri vsaki enostavni ničli spremeni predznak. Od desne: pozitiven nad $1$, negativen na $\left(\frac{1}{2}, 1\right)$, pozitiven na $\left(-1, \frac{1}{2}\right)$, negativen pod $-1$.
4. b) $p(x) < 0$ za $x \in (-\infty, -1) \cup \left(\frac{1}{2}, 1\right)$.
5. c) Za $t = \cos x$ mora biti $t$ ničla polinoma: $\cos x = -1$, $\cos x = \frac{1}{2}$ ali $\cos x = 1$.
6. c) Na $[0, 2\pi)$: $\cos x = 1$ da $x = 0$; $\cos x = -1$ da $x = \pi$; $\cos x = \frac{1}{2}$ da $x = \frac{\pi}{3}$ in $x = \frac{5\pi}{3}$.
7. Odgovor: ničle $-1$, $\frac{1}{2}$, $1$; neenačba velja na $(-\infty, -1) \cup \left(\frac{1}{2}, 1\right)$; rešitve enačbe so $0$, $\frac{\pi}{3}$, $\pi$ in $\frac{5\pi}{3}$.

**Točkovanje:** a) 1 točka za razcep in 1 točka za ničle; b) 1 točka za predznake med ničlami in 1 točka za pravilno unijo intervalov; c) 1 točka za tri enačbe za $\cos x$, 1 točka za $0$ in $\pi$, 1 točka za $\frac{\pi}{3}$ in $\frac{5\pi}{3}$.

### Naloga 3: krajša strukturirana naloga, 6 točk, pola 2 (z računalom)

Pravilna štiristrana piramida ima osnovni rob $a = 6\,\mathrm{cm}$ in stranski rob $s = 8\,\mathrm{cm}$. (geometrija v prostoru + kotne funkcije + prostornina teles)

a) Izračunajte višino piramide. Rezultat zaokrožite na dve decimalki. (2 točki)

b) Izračunajte kot med stranskim robom in osnovno ploskvijo. Rezultat zaokrožite na dve decimalki. (2 točki)

c) Izračunajte prostornino piramide. Rezultat zaokrožite na dve decimalki. (2 točki)

**Rešitev:**

1. a) Projekcija stranskega roba na osnovno ploskev je polovica diagonale kvadrata: $\frac{a\sqrt{2}}{2} = 3\sqrt{2} \approx 4{,}24\,\mathrm{cm}$.
2. a) Stranski rob, višina in polovica diagonale tvorijo pravokotni trikotnik: $v = \sqrt{64 - 18} = \sqrt{46} \approx 6{,}78\,\mathrm{cm}$.
3. b) Kot $\varphi$ med robom in osnovno ploskvijo je kot med robom in njegovo projekcijo: $\cos\varphi = \frac{3\sqrt{2}}{8}$, zato $\varphi \approx 57{,}97^\circ$.
4. c) $V = \frac{a^2 v}{3} = \frac{36\sqrt{46}}{3} = 12\sqrt{46} \approx 81{,}39\,\mathrm{cm^3}$.
5. Odgovor: višina je $6{,}78\,\mathrm{cm}$, kot meri $57{,}97^\circ$, prostornina je $81{,}39\,\mathrm{cm^3}$.

**Točkovanje:** a) 1 točka za polovico diagonale in 1 točka za višino $6{,}78\,\mathrm{cm}$; b) 1 točka za pravilno kotno funkcijo v trikotniku z robom in projekcijo in 1 točka za $57{,}97^\circ$; c) 1 točka za formulo z $\frac{1}{3}$ in 1 točka za $81{,}39\,\mathrm{cm^3}$.

### Naloga 4 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Dana je krožnica $K$ z enačbo $x^2 + y^2 - 6x - 4y + 8 = 0$ in premica $p$ z enačbo $y = x$. (krožnica + kvadratna enačba + skalarni produkt + tangenta + ploščina trikotnika)

a) Določite središče $S$ in polmer krožnice. (2 točki)

b) Izračunajte presečišči $A$ in $B$ krožnice s premico $p$, pri čemer ima $A$ manjšo absciso. (2 točki)

c) Izračunajte $\cos\angle ASB$. (2 točki)

d) Zapišite enačbo tangente na krožnico v točki $A$. (2 točki)

e) Izračunajte ploščino trikotnika $ASB$. (2 točki)

**Rešitev:**

1. a) Dopolnimo do popolnih kvadratov: $(x - 3)^2 + (y - 2)^2 = 9 + 4 - 8 = 5$. Središče je $S(3, 2)$, polmer $r = \sqrt{5}$.
2. b) Vstavimo $y = x$: $2x^2 - 10x + 8 = 0$ oziroma $x^2 - 5x + 4 = 0$, torej $x = 1$ ali $x = 4$. Presečišči sta $A(1, 1)$ in $B(4, 4)$.
3. c) $\vec{SA} = (-2, -1)$, $\vec{SB} = (1, 2)$, skalarni produkt $-2 - 2 = -4$, dolžini sta $\sqrt{5}$.
4. c) $\cos\angle ASB = \frac{-4}{\sqrt{5} \cdot \sqrt{5}} = -\frac{4}{5}$; kot je top.
5. d) Tangenta v $A$ je pravokotna na polmer $\vec{SA} = (-2, -1)$, ki je njen normalni vektor: $-2(x - 1) - (y - 1) = 0$, torej $y = -2x + 3$.
6. e) Kot trikotnika leži med $0^\circ$ in $180^\circ$, zato je njegov sinus pozitiven: $\sin\angle ASB = \sqrt{1 - \frac{16}{25}} = \frac{3}{5}$.
7. e) $S_{ASB} = \frac{1}{2} \cdot \sqrt{5} \cdot \sqrt{5} \cdot \frac{3}{5} = \frac{3}{2}$.
8. Odgovor: $S(3, 2)$, $r = \sqrt{5}$; $A(1, 1)$, $B(4, 4)$; $\cos\angle ASB = -\frac{4}{5}$; tangenta $y = -2x + 3$; ploščina $\frac{3}{2}$ kvadratne enote.

**Točkovanje:** a) 1 točka za središče in 1 točka za polmer; b) 1 točka za kvadratno enačbo in 1 točka za obe točki; c) 1 točka za vektorja in skalarni produkt, 1 točka za $-\frac{4}{5}$; d) 1 točka za normalni vektor $\vec{SA}$, 1 točka za enačbo tangente; e) 1 točka za $\sin\angle ASB = \frac{3}{5}$, 1 točka za ploščino $\frac{3}{2}$.

### Ustno vprašanje 1

:::premisli
Definiraj skalarni produkt dveh vektorjev. Kako z njim ugotoviš, ali sta vektorja pravokotna, in kako izračunaš kot med njima?
---
Skalarni produkt je $\vec a \cdot \vec b = |\vec a|\,|\vec b|\cos\varphi$, kjer je $\varphi$ kot med vektorjema. V pravokotnem koordinatnem sistemu je $\vec a \cdot \vec b = a_1 b_1 + a_2 b_2 (+ a_3 b_3)$. Neničelna vektorja sta pravokotna natanko tedaj, ko je skalarni produkt $0$. Kot dobiš iz $\cos\varphi = \frac{\vec a \cdot \vec b}{|\vec a|\,|\vec b|}$; negativen skalarni produkt pomeni top kot.
:::

### Ustno vprašanje 2

:::premisli
(višja raven) Kdaj je premica tangenta krožnice? Opiši dva načina, kako to preveriš.
---
Premica je tangenta, če ima s krožnico natanko eno skupno točko. Prvi način: enačbo premice vstaviš v enačbo krožnice in dobiš kvadratno enačbo; premica je tangenta, ko je diskriminanta $0$. Drugi način: razdalja od središča krožnice do premice je enaka polmeru. Tangenta je pravokotna na polmer v dotikališču.
:::

### Ustno vprašanje 3

:::premisli
Kaj je ničla polinoma in kako je povezana z delitelji polinoma? Kako poiščeš ostale ničle, ko eno poznaš?
---
Število $a$ je ničla polinoma $p$, če je $p(a) = 0$. Po izreku o ničli je tedaj $p(x) = (x - a)\,q(x)$, torej je $x - a$ delitelj polinoma. Količnik $q$ dobiš s Hornerjevim algoritmom; njegova stopnja je za ena manjša, ostale ničle so ničle količnika. Celoštevilske ničle polinoma s celimi koeficienti so delitelji prostega člena.
:::

## Drugače: Korak za korakom s številkami

Kozarec za koktajl iz Primera 3, vse s števili:

1. Cel kozarec: $r = 4$, $v = 12$, prostornina $64\pi \approx 201{,}1\,\mathrm{cm^3}$.
2. Do višine $6$ (polovica): polmer gladine $2$, prostornina $\frac{\pi \cdot 4 \cdot 6}{3} = 8\pi \approx 25{,}1\,\mathrm{cm^3}$. To je osmina, ne polovica.
3. Do višine $9$: polmer $3$, prostornina $\frac{\pi \cdot 9 \cdot 9}{3} = 27\pi \approx 84{,}8\,\mathrm{cm^3}$. Še vedno manj kot $32\pi \approx 100{,}5\,\mathrm{cm^3}$.
4. Do višine $10$: polmer $\frac{10}{3}$, prostornina $\frac{1000\pi}{27} \approx 116{,}4\,\mathrm{cm^3}$. Preveč.
5. Gladina je torej med $9$ in $10\,\mathrm{cm}$; natančen račun da $9{,}52\,\mathrm{cm}$.

Tak preizkus s števili ni dokaz, je pa dobra kontrola: če bi račun dal $6\,\mathrm{cm}$ ali $11{,}9\,\mathrm{cm}$, bi takoj vedel, da je nekaj narobe.

## Drugače: Kot zgodba

Maja peče za rojstni dan. V kuhinji ima pločevino $30 \times 30\,\mathrm{cm}$ in recept za liter testa. Najprej prereže vogale »na oko«, po $2\,\mathrm{cm}$, in natoči vodo: v pekač gre $1352\,\mathrm{cm^3}$, preveč. Brat predlaga $10\,\mathrm{cm}$ in pekač drži natanko liter, a je globok kot lonec. Maja hoče plitvega.

Sede in zapiše $x(30 - 2x)^2 = 1000$. Brat se spomni Hornerja: ker je $10$ že rešitev, ostane kvadratna enačba. Dobita še $1{,}34$ in $18{,}66$. »$18{,}66$ ne gre,« reče Maja, »pločevina ima samo $30\,\mathrm{cm}$.« Izreže kvadratke s stranico $1{,}3\,\mathrm{cm}$ in biskvit je plitev in hrustljav.

V zgodbi so vsi koraki mešane naloge: poskus s števili, enačba, orodje drugega poglavja in izbor rešitve z zdravo pametjo.

## Preveri se

? Z grafa odčitaj ničle in presečišče z osjo $y$. Kateri predpis pripada grafu?
:::risba graf
opis: Graf polinoma tretje stopnje. Seka os x v točkah −2, 1 in 3, os y v točki 3. Levo od −2 je pod osjo x, med −2 in 1 nad njo, med 1 in 3 pod njo, desno od 3 nad njo.
x: -3 .. 4 | 1 | x
y: -6 .. 6 | 1 | y
f: 0,5*(x+2)*(x-1)*(x-3) | modra | -2,5 .. 3,6
točka: -2; 0 | −2 | nad levo
točka: 1; 0 | 1 | pod levo
točka: 3; 0 | 3 | nad levo
točka: 0; 3 | (0; 3) | desno
:::
- $p(x) = 0{,}5(x - 2)(x + 1)(x + 3)$
~ Ničla $-2$ da faktor $x + 2$, ne $x - 2$: pri $x = -2$ mora biti faktor enak $0$.
- $p(x) = (x + 2)(x - 1)(x - 3)$
~ Ničle so prave, a ta polinom ima $p(0) = 6$. Graf seka os $y$ pri $3$, zato je pred faktorji $0{,}5$.
+ $p(x) = 0{,}5(x + 2)(x - 1)(x - 3)$
> Ničle $-2$, $1$, $3$ dajo faktorje $(x + 2)(x - 1)(x - 3)$, ki imajo pri $x = 0$ vrednost $6$. Z grafa je $p(0) = 3$, zato je vodilni koeficient $0{,}5$.

? Oceni: stožčast kozarec (konica spodaj) napolniš do treh četrtin višine. Koliko odstotkov prostornine kozarca zavzame sok?
= 42,2 % | 1
~ 75 | Višina se pomnoži s $\frac{3}{4}$, prostornina pa s $\left(\frac{3}{4}\right)^3$, ker se skupaj z višino zmanjša tudi polmer gladine.
~ 56 | To je $\left(\frac{3}{4}\right)^2$, sprememba ploščine. Prostornina se spremeni s kubom koeficienta.
> Sok je stožec, podoben kozarcu s koeficientom $\frac{3}{4}$: $\left(\frac{3}{4}\right)^3 = \frac{27}{64} \approx 0{,}42$, torej približno $42\,\%$.

? Zakaj pri pekaču iz pločevine $30 \times 30\,\mathrm{cm}$ rešitev $x \approx 18{,}66\,\mathrm{cm}$ zavržemo?
- Ker ni celo število.
~ Tudi $1{,}34$ ni celo število, pa je dobra rešitev. Mere so lahko decimalne.
+ Ker bi bila stranica dna $30 - 2x$ negativna; pekač mora imeti $0 < x < 15$.
- Ker ima polinom tretje stopnje največ dve pozitivni ničli.
~ Polinom tretje stopnje ima lahko tri pozitivne ničle, ta jih tudi ima: $1{,}34$; $10$ in $18{,}66$.
> Enačba $x(30 - 2x)^2 = 1000$ ne ve, da gre za pekač. Pri $x = 18{,}66$ je $(30 - 2x)^2$ sicer pozitiven, a stranica dna $30 - 2x \approx -7{,}3$ ni dolžina. Geometrijska omejitev to rešitev izloči.

? (višja raven) Premica $y = x + n$ se dotika krožnice $x^2 + y^2 = 2$. Izračunaj pozitivni $n$ (brez računala).
= 2 | 0,01
~ 1,41 | To je polmer $\sqrt{2}$. Število $n$ je presečišče premice z osjo $y$, ne razdalja premice od središča.
~ 4 | To je $n^2$. Iz $n^2 = 4$ vzemi še koren.
> Vstavimo: $2x^2 + 2nx + n^2 - 2 = 0$. Diskriminanta $4n^2 - 8(n^2 - 2) = 16 - 4n^2 = 0$, zato $n^2 = 4$ in $n = 2$.

? Kocka ima oglišče v izhodišču in robove na koordinatnih oseh. Kolikšen kot oklepa telesna diagonala s smerjo $(1, 1, 1)$ z robom v smeri $(1, 0, 0)$?
- $35{,}26^\circ$
~ To je kot med telesno diagonalo in osnovno ploskvijo. Tu iščemo kot z robom.
- $0{,}96^\circ$
~ Računalo je bilo v radianih: $0{,}96$ radiana je približno $54{,}74^\circ$.
+ $54{,}74^\circ$
- $45^\circ$
~ $45^\circ$ oklepa ploskovna diagonala z robom, telesna diagonala je bolj nagnjena.
> $\cos\varphi = \frac{(1, 1, 1) \cdot (1, 0, 0)}{\sqrt{3} \cdot 1} = \frac{1}{\sqrt{3}}$, zato $\varphi \approx 54{,}74^\circ$. Kota $54{,}74^\circ$ in $35{,}26^\circ$ se dopolnjujeta do $90^\circ$.

:::simboli
V | prostornina | | cm^3 |
x | stranica izrezanega kvadratka ali neznanka | | cm |
n | odsek premice na osi $y$ | | |
D | diskriminanta | D = b^2 - 4ac | |
\vec a, \vec b | vektorja | | |
\varphi | kot med vektorjema; kot med robom in osnovno ploskvijo | \cos\varphi = \frac{\vec a \cdot \vec b}{\lvert\vec a\rvert\,\lvert\vec b\rvert} | ° |
a, b, c | stranice trikotnika; koeficienti kvadratne enačbe | | cm | v Nalogi 3 je $a$ osnovni rob piramide
s | stranski rob piramide | | cm |
p | polinom; premica | | |
\alpha, \gamma | kota trikotnika | | ° |
R | polmer očrtanega kroga | 2R = \frac{a}{\sin\alpha} | cm |
f, g | funkciji | | |
S | ploščina osnovne ploskve ali trikotnika; središče krožnice | | cm^2 |
v | višina telesa, globina kozarca | | cm |
A, B, C | oglišča trikotnika ali točke na krožnici | | |
r | polmer roba kozarca | | cm |
\rho | polmer gladine soka | \rho = \frac{h}{3} | cm |
h | višina gladine nad konico | | cm |
x_1, x_2 | rešitvi kvadratne enačbe | | |
:::

<<RACUN
vrednost: 1*28^2 | 784
vrednost: 2*26^2 | 1352
vrednost: 5*20^2 | 2000
vrednost: 10*10^2 | 1000
vrednost: 14*2^2 | 56
resi: x^3-30*x^2+225*x-250=0 | x | 10, 10-5*sqrt(3), 10+5*sqrt(3)
resi: x*(30-2*x)^2=1000 | x | 10, 10-5*sqrt(3), 10+5*sqrt(3)
vrednost: 4*4^2-8*(4^2-8) | 0
vrednost: 64-4*2^2 | 48
vrednost: 64-4*6^2 | -80
resi: 2*x^2+8*x+8=0 | x | -2
vrednost: acos(8/(4*2*sqrt(2)))*180/pi | 45
vrednost: 1/2*4*2*sqrt(2)*sqrt(2)/2 | 4
neenacba: (x+6)/x>x | x | (-oo, -2) U (0, 3)
vrednost: pi*16*12/3 | 201.1
resi: pi*h^3/27=32*pi | h | 864^(1/3)
vrednost: 864^(1/3) | 9.52
resi: x^2-20*x+25=0 | x | 10-5*sqrt(3), 10+5*sqrt(3)
vrednost: 10-5*sqrt(3) | 1.34
vrednost: 10+5*sqrt(3) | 18.66
vrednost: 6/(2*sin(30*pi/180)) | 6
resi: 2*x^3-x^2-2*x+1=0 | x | -1, 1/2, 1
neenacba: 2*x^3-x^2-2*x+1<0 | x | (-oo, -1) U (1/2, 1)
vrednost: sqrt(64-18) | 6.78
vrednost: acos(3*sqrt(2)/8)*180/pi | 57.97
vrednost: 12*sqrt(46) | 81.39
resi: x^2-5*x+4=0 | x | 1, 4
vrednost: (-2*1+(-1)*2)/5 | -4/5
vrednost: 1/2*5*3/5 | 3/2
vrednost: (3/4)^3*100 | 42.19
resi: 2*x^2+2*2*x+2^2-2=0 | x | -1
vrednost: acos(1/sqrt(3))*180/pi | 54.74
vrednost: pi*1000/27 | 116.4
>>
