---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tjaša je medicinska sestra na intenzivni negi. Bolniku dve uri dovaja zdravilo z infuzijsko črpalko, nato črpalko ustavi. Monitor riše koncentracijo zdravila v krvi in pod grafom izpisuje, kako hitro se koncentracija spreminja. Dve uri raste enakomerno, potem začne padati. Točno ob ustavitvi pa monitor namesto števila izpiše »ni določeno«.

Je program pokvarjen? Tjaša mora vedeti, ali lahko podatku zaupa. Odgovor se skriva v obliki grafa: v tistem trenutku ima graf oster lom. Ko boš to razumel, boš s pogledom na graf prepoznal, kje odvod ne obstaja. Na višji ravni boš spoznal še, zakaj je vsaka odvedljiva funkcija zvezna, in odvajal krivulje, kot sta krožnica in elipsa, ki niso grafi ene same funkcije.

## Razlaga

**1. Pogled skozi povečevalno steklo.** Na graf funkcije $f(x) = x^2$ postavi povečevalno steklo pri točki $(1, 1)$ in ga povečuj. Krivulja je v steklu vse bolj ravna in na koncu je videti kot premica, tangenta s smernim koeficientom $f'(1) = 2$.

Zdaj enako naredi pri grafu $f(x) = |x|$ v izhodišču. Ne glede na povečavo vidiš vedno isto črko V. Levi krak ima naklon $-1$, desni $+1$. Ene same premice, ki bi se grafu prilegala, ni.

:::risba graf
opis: Graf funkcije absolutna vrednost x na intervalu od −3 do 3, v obliki črke V z vogalom v izhodišču. Levi krak gre skozi točko (−2, 2) in ima naklon −1, desni krak gre skozi (2, 2) in ima naklon +1. Oba kraka sta hkrati tudi sekanti iz izhodišča.
x: -3 .. 3 | 1
y: -1 .. 3 | 1
enako: da
f: abs(x) | modra debelo
točka: 0; 0 | vogal | pod
točka: -2; 2 | naklon −1 | desno
točka: 2; 2 | naklon +1 | levo
:::

Isto pove tabela diferenčnih količnikov $\frac{f(0 + h) - f(0)}{h} = \frac{|h|}{h}$:

| $h$ | $\frac{\lvert h \rvert}{h}$ |
|---|---|
| $-0{,}1$ | $-1$ |
| $-0{,}01$ | $-1$ |
| $0{,}01$ | $1$ |
| $0{,}1$ | $1$ |

Z leve je limita $-1$, z desne $1$. Ker se razlikujeta, limita ne obstaja in $f'(0)$ ne obstaja.

Funkcija je v točki $a$ **odvedljiva**, če ima tam odvod, torej če ima diferenčni količnik pri $h \to 0$ limito (z leve in desne enako).

V simulaciji spodaj izberi $x^2$, postavi $x_0 = 1$ in zmanjšuj $h$. Opazi, kako se sekanta vse bolj prilega tangenti. Pri $|x|$ v izhodišču bi se sekante z leve ustalile na enem kraku, z desne na drugem.

**2. Štirje znaki na grafu.** Točke, kjer funkcija ni odvedljiva, na grafu prepoznaš po obliki.

| oblika | primer | tangenta |
|---|---|---|
| vogal | $\lvert x \rvert$ pri $0$ | dva različna kraka |
| ost | $\sqrt[3]{x^2}$ pri $0$ | kraka se stikata navpično |
| navpična tangenta | $\sqrt[3]{x}$ pri $0$ | navpična premica |
| nezveznost | skok, luknja, pol | ni je |

Pri osti in navpični tangenti je graf v tej točki strm kot stena. Kaj to pomeni za diferenčni količnik, preveri sam.

:::risba graf
opis: Dva grafa. Levo je y = kubični koren iz (x + 2)², ki ima pri x = −2 ost: oba kraka se v točki (−2, 0) stikata navpično, oblika spominja na ptico z razprtimi krili. Desno je y = kubični koren iz (x − 2), ki ima v točki (2, 0) navpično tangento, narisano črtkano.
x: -4 .. 4 | 1
y: -2 .. 2 | 1
f: cbrt((x + 2)^2) | modra | -4 .. 0
f: cbrt(x - 2) | oranžna | 0 .. 4
črta: 2; -2 -> 2; 2 | črtkano siva
točka: -2; 0 | ost | pod
točka: 2; 0 | navpična tangenta | desno
:::

:::premisli
Za $f(x) = \sqrt[3]{x}$ je diferenčni količnik v $0$ enak $\frac{\sqrt[3]{h}}{h}$. Napovej, kaj se z njim dogaja, ko je $h$ vse manjši, nato preveri pri $h = 0{,}001$.
---
Raste čez vse meje. Pri $h = 0{,}001$ je $\sqrt[3]{0{,}001} = 0{,}1$ in količnik $\frac{0{,}1}{0{,}001} = 100$, pri $h = 0{,}000001$ že $10\,000$. Sekante so vse bolj navpične, končnega odvoda ni.
:::

**3. Odvedljiva funkcija je zvezna (višja raven).** Če je $f$ v točki $a$ odvedljiva, je tam tudi zvezna. Razliko vrednosti zapišemo kot produkt:

$$f(a + h) - f(a) = \frac{f(a + h) - f(a)}{h} \cdot h$$

Ko gre $h \to 0$, gre prvi faktor proti $f'(a)$, drugi proti $0$. Produkt gre proti $f'(a) \cdot 0 = 0$, torej $f(a + h) \to f(a)$. To je natanko zveznost.

(višja raven) Obrat ne velja: $|x|$ je v $0$ zvezna, odvedljiva pa ne. Velja pa enakovreden zapis izreka: kjer je funkcija nezvezna, ni odvedljiva. Zato je vsak skok, luknja ali pol hkrati točka neodvedljivosti.

**4. Odvod implicitno podane funkcije (višja raven).** Narišimo krožnico $x^2 + y^2 = 25$ in na njej točko $T(3, 4)$.

:::risba graf
opis: Krožnica s središčem v izhodišču in polmerom 5. Na njej je točka T(3, 4). Črtkano je narisan polmer od izhodišča do T, oranžno tangenta skozi T, ki pada in je pravokotna na polmer.
x: -6 .. 7 | 1
y: -6 .. 7 | 1
enako: da
f: sqrt(25 - x^2) | modra
f: -sqrt(25 - x^2) | modra
f: -3/4*x + 25/4 | oranžna | 0,5 .. 7
črta: 0; 0 -> 3; 4 | črtkano siva
točka: 3; 4 | T(3, 4) | desno
:::

Krožnica ni graf ene funkcije: nad $x = 3$ ležita točki $(3, 4)$ in $(3, -4)$. Blizu točke $T$ pa je zgornji lok graf funkcije $y(x)$. Rečemo, da je ta funkcija **implicitno podana** z enačbo $x^2 + y^2 = 25$: ni zapisana kot $y = \dots$, je pa skrita v zvezi med $x$ in $y$.

Odvajamo obe strani enačbe po $x$ in pri tem $y$ obravnavamo kot funkcijo $x$. Člen $y^2$ odvajamo po verižnem pravilu, $(y^2)' = 2y \cdot y'$. Desna stran je konstanta, njen odvod je $0$:

$$2x + 2y\,y' = 0$$

$$y' = -\frac{x}{y}$$

V točki $T$: $y' = -\frac{3}{4}$. Tangenta je $y - 4 = -\frac{3}{4}(x - 3)$ oziroma $y = -\frac{3}{4}x + \frac{25}{4}$. Polmer do $T$ ima naklon $\frac{4}{3}$, produkt naklonov je $-1$: tangenta je pravokotna na polmer, kot ve geometrija.

:::premisli
Kaj se zgodi s formulo $y' = -\frac{x}{y}$ v točki $(5, 0)$? Kaj to pove o tangenti tam?
---
Imenovalec je $0$, odvod ne obstaja. Na sliki se vidi zakaj: v točki $(5, 0)$ je tangenta na krožnico navpična premica $x = 5$. Implicitni odvod sam opozori na navpično tangento.
:::

## Rešeni primeri

### Primer 1: infuzija, ki se ustavi

Koncentracija zdravila v krvi je med infuzijo $c(t) = 4t$ za $0 \le t \le 2$, po ustavitvi črpalke pa $c(t) = 8e^{-0{,}5(t - 2)}$ za $t > 2$ ($c$ v $\mathrm{mg/L}$, $t$ v urah). Ali je $c$ v $t = 2$ zvezna? Ali je odvedljiva?

**Podatki:** $c(t) = 4t$ za $0 \le t \le 2$; $c(t) = 8e^{-0{,}5(t - 2)}$ za $t > 2$; točka $t = 2\,\mathrm{h}$
**Iščemo:** zveznost in odvedljivost v $t = 2$

:::formula
Zvezna: leva in desna limita sta enaki $c(2)$. Odvedljiva: smerna koeficienta z leve in desne sta enaka.
:::

**Rešitev:**

1. Vrednost: $c(2) = 4 \cdot 2 = 8$. Desni del se pri $t \to 2$ približuje $8e^0 = 8$. Funkcija je zvezna, graf se ne pretrga.
2. Z leve je $c(t) = 4t$ premica, njen smerni koeficient je $4$.
3. Z desne: $c'(t) = 8e^{-0{,}5(t - 2)} \cdot (-0{,}5) = -4e^{-0{,}5(t - 2)}$, verižno pravilo. Pri $t = 2$ je to $-4$.
4. Smerna koeficienta $4$ in $-4$ se razlikujeta. Na grafu je vogal.
5. Odgovor: $c$ je v $t = 2$ zvezna, ni pa odvedljiva. Monitor je imel prav: hitrost spreminjanja tik pred ustavitvijo je $4\,\mathrm{mg/(L\,h)}$, tik po njej $-4\,\mathrm{mg/(L\,h)}$, ene vrednosti ni.

:::risba graf
opis: Koncentracija zdravila v odvisnosti od časa. Od 0 do 2 ur premica naraste od 0 do 8 mg/L, nato graf pada in se počasi približuje osi: pri 4 urah je približno 2,9, pri 8 urah približno 0,4. Pri 2 urah je oster vogal.
x: 0 .. 8 | 1 | t [h]
y: 0 .. 9 | 1 | c [mg/L]
f: 4*x | modra | 0 .. 2
f: 8*exp(-0.5*(x - 2)) | modra | 2 .. 8
točka: 2; 8 | vogal | desno
:::

### Primer 2 (višja raven): tangenta na očesno lečo

V poenostavljenem modelu ima prerez očesne leče obliko elipse $\frac{x^2}{25} + \frac{y^2}{9} = 1$ (enota mm). Zapiši enačbo tangente v točki $T(4; 1{,}8)$.

**Podatki:** elipsa $\frac{x^2}{25} + \frac{y^2}{9} = 1$, točka $T(4; 1{,}8)$, enota mm
**Iščemo:** smerni koeficient $k$ in enačbo tangente

:::formula
Implicitni odvod: odvajaj obe strani po $x$, $(y^2)' = 2y\,y'$. Tangenta: $y - y_0 = k(x - x_0)$, $k = y'(x_0, y_0)$.
:::

**Rešitev:**

1. Točka leži na elipsi: $\frac{16}{25} + \frac{3{,}24}{9} = 0{,}64 + 0{,}36 = 1$.
2. Odvajamo: $\frac{2x}{25} + \frac{2y\,y'}{9} = 0$, zato $y' = -\frac{9x}{25y}$.
3. Vstavimo $T$: $k = -\frac{9 \cdot 4}{25 \cdot 1{,}8} = -\frac{36}{45} = -0{,}8$.
4. Tangenta: $y - 1{,}8 = -0{,}8(x - 4)$, torej $y = -0{,}8x + 5$.
5. Odgovor: tangenta na lečo v $T$ je $y = -0{,}8x + 5$. Žarek, ki pade na lečo, se lomi glede na pravokotnico na to premico.

:::risba graf
opis: Elipsa s polosema 5 vzdolž osi x in 3 vzdolž osi y. Na njej je točka T(4; 1,8), skozi katero gre oranžna tangenta y = −0,8x + 5; os y seka v 5, os x v 6,25.
x: -6 .. 7 | 1
y: -4 .. 6 | 1
enako: da
f: 3*sqrt(1 - x^2/25) | modra
f: -3*sqrt(1 - x^2/25) | modra
f: -4/5*x + 5 | oranžna | 0 .. 6,25
točka: 4; 1,8 | T | desno
:::

### Primer 3 (težji, višja raven): kje se ploščica dotakne sklepa

Glava stegnenice ima v prerezu obliko krožnice $x^2 + y^2 = 625$ (enota mm). Ortoped mora ob glavo postaviti ravno ploščico, ki se je dotika in ima smerni koeficient $\frac{3}{4}$. V katerih točkah je to mogoče in kakšni sta premici?

**Podatki:** krožnica $x^2 + y^2 = 625$ (polmer $25\,\mathrm{mm}$), smerni koeficient tangente $k = \frac{3}{4}$
**Iščemo:** dotikališči in enačbi tangent

:::formula
$y' = -\dfrac{x}{y}$ za krožnico $x^2 + y^2 = r^2$; pogoj $-\dfrac{x}{y} = k$ in točka na krožnici.
:::

**Rešitev:**

1. Odvod: $2x + 2y\,y' = 0$, torej $y' = -\frac{x}{y}$.
2. Pogoj: $-\frac{x}{y} = \frac{3}{4}$, zato $y = -\frac{4}{3}x$.
3. Vstavimo v krožnico: $x^2 + \frac{16}{9}x^2 = 625$, torej $\frac{25}{9}x^2 = 625$ in $x^2 = 225$.
4. Dobimo $x = 15$, $y = -20$ ali $x = -15$, $y = 20$.
5. Tangenti: skozi $(15, -20)$ je $y = \frac{3}{4}x - \frac{125}{4}$, skozi $(-15, 20)$ je $y = \frac{3}{4}x + \frac{125}{4}$.
6. Preizkus: $\frac{3}{4} \cdot 15 - \frac{125}{4} = \frac{45 - 125}{4} = -20$.
7. Odgovor: ploščica se dotika v $(15, -20)$ ali v $(-15, 20)$, na nasprotnih straneh glave.

### Primer 4 (višja raven): zdaj ti

Krivulja ima enačbo $x^2 + xy + y^2 = 7$. Poišči smerni koeficient tangente v točki $T(1, 2)$ in enačbo tangente.

**Podatki:** $x^2 + xy + y^2 = 7$, točka $T(1, 2)$
**Iščemo:** $k = y'(1, 2)$ in tangento

:::formula
$(xy)' = 1 \cdot y + x \cdot y'$ (pravilo za odvod produkta), $(y^2)' = 2y\,y'$.
:::

**Rešitev:**

1. Preverimo točko: $1 + 2 + 4 = 7$.
2. Odvajamo: $2x + y + x\,y' + 2y\,y' = 0$.
3. Izrazimo: $y'(x + 2y) = -(2x + y)$, torej $y' = -\frac{2x + y}{x + 2y}$.
4. Vstavi točko sam in zapiši tangento.

:::premisli
Koliko je $k$ v $T(1, 2)$ in kakšna je tangenta?
---
$k = -\frac{2 + 2}{1 + 4} = -\frac{4}{5} = -0{,}8$. Tangenta: $y - 2 = -0{,}8(x - 1)$, torej $y = -0{,}8x + 2{,}8$.
:::

## Pogoste napake

- **»Zvezna, torej odvedljiva.«** Graf $|x|$ je brez prekinitve, pa vseeno nima odvoda v $0$. Zveznost je nujna za odvedljivost, ni pa dovolj. Na grafu išči še vogale, osti in navpične tangente.
- **Odvod v vogalu kot povprečje.** Pri $|x|$ v $0$ kdo izračuna $\frac{-1 + 1}{2} = 0$ in reče, da je tangenta vodoravna. Odvod ni povprečje smeri; ko sta smeri različni, ga ni.
- **Navpična tangenta »ima odvod neskončno«.** Neskončno ni število. Pri navpični tangenti odvod ne obstaja, čeprav tangenta obstaja.
- **Pozabljeni $y'$ (višja raven).** Iz $y^2$ nastane $2y$ namesto $2y\,y'$. Ker je $y$ funkcija od $x$, odvajaš po verižnem pravilu, tako kot $(g(x)^2)' = 2g(x)\,g'(x)$.
- **Konstanta na desni (višja raven).** Pri $x^2 + y^2 = 25$ nekdo pusti desno stran $25$. Odvod konstante je $0$. Prav tako ne vstavljaj točke pred odvajanjem: dobiš $25 = 25$ in iz tega odvoda ni.

## Povzetek

- $f$ je odvedljiva v $a$, če obstaja $f'(a)$: limiti diferenčnega količnika z leve in z desne obstajata in sta enaki.
- Na grafu $f$ ni odvedljiva v vogalu ($|x|$), osti ($\sqrt[3]{x^2}$), pri navpični tangenti ($\sqrt[3]{x}$) in v točki nezveznosti.
- (višja raven) Odvedljiva funkcija je zvezna; obrat ne velja ($|x|$). Nezvezna funkcija ni odvedljiva.
- (višja raven) Implicitni odvod: obe strani enačbe odvajaj po $x$, $y$ je funkcija od $x$: $(y^2)' = 2y\,y'$, $(xy)' = y + x\,y'$; izrazi $y'$ in nato vstavi točko.
- (višja raven) Krožnica $x^2 + y^2 = r^2$: $y' = -\frac{x}{y}$; pri $y = 0$ je tangenta navpična.

## Drugače: Z analogijo

Graf si predstavljaj kot tire, po katerih pelje vlak. Na gladkem tiru ima vlak v vsakem trenutku točno določeno smer vožnje: to je tangenta. Če je tir na enem mestu prelomljen v vogal, vlak tam nima smeri, saj bi moral v trenutku zaviti. Pri osti bi moral naravnost navzgor, pri skoku tir sploh ni sklenjen.

(višja raven) Implicitna enačba je kot vrv med dvema plezalcema, $x$ in $y$. Ko se eden premakne, se mora premakniti tudi drugi, da vrv ostane napeta. Odvajanje obeh strani pove, za koliko se premakne $y$, ko se $x$ premakne za malo: vrv (enačba) mora veljati tudi po premiku.

## Drugače: Iz vsakdanjega življenja

Na zapisu EKG je najvišji zob srčnega utripa videti kot ostra konica. Če bi ga gledal le kot črto na papirju, bi bila tam ost in ena sama strmina ne bi obstajala. Pri povečavi pa se pokaže, da je vrh zaobljen, zato zdravnik lahko govori o hitrosti spremembe tudi tam.

(višja raven) Avto v krožišču s polmerom $25\,\mathrm{m}$ pelje po krožnici $x^2 + y^2 = 625$. Ko voznik v točki $(15, -20)$ izpusti volan, gre avto naravnost po tangenti s smernim koeficientom $y' = -\frac{x}{y} = \frac{3}{4}$. Zato je izvoz iz krožišča speljan v smeri tangente.

## Preveri se

? Na grafu so označene štiri točke. Katera ne sodi med ostale?
:::risba graf
opis: Graf funkcije na intervalu od 0 do 6. Od x = 0 do x = 3 je lomljena črta y = 1 + |x − 2|: pri x = 0 je 3, pri x = 1 je 2, pri x = 2 vogal na višini 1, pri x = 3 polna točka na višini 2. Pri x = 3 graf skoči: prazen krožec na višini 3, od tam krivulja y = 4 + kubični koren iz (x − 4), ki ima pri x = 4 navpično tangento na višini 4, pri x = 6 je približno 5,3.
x: 0 .. 6 | 1
y: 0 .. 6 | 1
f: 1 + abs(x - 2) | modra | 0 .. 3
f: 4 + cbrt(x - 4) | modra | 3 .. 6
točka: 3; 2 | | |
krog: 3; 3 | 0,08 | modra
oznakax: 1 | A
oznakax: 2 | B
oznakax: 3 | C
oznakax: 4 | D
:::
- B, $x = 2$
~ Pri $x = 2$ je vogal: kraka imata naklon $-1$ in $1$, odvoda ni. To je ena od treh enakih.
+ A, $x = 1$
- C, $x = 3$
~ Pri $x = 3$ graf skoči. Nezvezna funkcija ni odvedljiva, zato C sodi k ostalim.
- D, $x = 4$
~ Pri $x = 4$ je tangenta navpična in odvod ne obstaja; D sodi k ostalim.
> Pri $x = 1$ je graf del premice $y = 3 - x$, odvod je $-1$. V B (vogal), C (skok) in D (navpična tangenta) odvod ne obstaja.

? Funkcija $f(x) = \lvert x^2 - 4 \rvert$ je narisana spodaj. V koliko točkah je $f$ zvezna, ni pa odvedljiva?
:::risba graf
opis: Graf funkcije f(x) = |x² − 4| na intervalu od −3 do 3, v obliki črke W. Pri x = −3 je vrednost 5, graf pada do 0 pri x = −2, kjer je oster vogal. Nato se dvigne v zaobljen vrh 4 pri x = 0, spusti do 0 pri x = 2, kjer je spet oster vogal, in naraste do 5 pri x = 3.
x: -3 .. 3 | 1
y: -1 .. 6 | 1
f: abs(x^2 - 4) | modra debelo
:::
= 2 | 0,1
~ 3 | Pri $x = 0$ je vrh zaobljen: tam je $f(x) = 4 - x^2$, $f'(0) = 0$, tangenta je vodoravna.
~ 1 | Graf je simetričen: vogal je pri $x = 2$ in tudi pri $x = -2$.
~ 0 | Zvezna funkcija ni nujno odvedljiva. Poglej, kje ima graf ostre vogale.
> Med $-2$ in $2$ absolutna vrednost prezrcali parabolo čez os $x$. Pri $x = 2$ je naklon z leve $(4 - x^2)' = -2x = -4$, z desne $(x^2 - 4)' = 2x = 4$: vogal. Enako pri $x = -2$. Funkcija je povsod zvezna, odvoda ni le v teh dveh točkah.

? (višja raven) Funkcija $f$ ima v točki $a$ skok. Zakaj zaradi tega v $a$ ni odvedljiva?
+ Ker je vsaka odvedljiva funkcija zvezna, $f$ pa v $a$ ni zvezna.
- Ker sta levi in desni smerni koeficient vedno nasprotni števili.
~ To velja pri $|x|$ v $0$, pri skoku pa je diferenčni količnik z ene strani neomejen.
- Ker zvezne funkcije niso odvedljive.
~ Polinomi so zvezni in odvedljivi. Ne velja le obrat »zvezna ⇒ odvedljiva«.
- Ni nujno: če sta kosa grafa vzporedna, je odvedljiva.
~ Tudi pri vzporednih kosih $f(a + h) - f(a)$ ne gre proti $0$, zato diferenčni količnik z ene strani raste čez vse meje.
> Odvedljiva ⇒ zvezna. Ker $f$ v $a$ ni zvezna, ne more biti odvedljiva.

? (višja raven) (brez računala) Kolikšen je smerni koeficient tangente na krožnico $x^2 + y^2 = 25$ v točki $(-3, 4)$?
= 0,75 | 0,001
~ -0,75 | To je smerni koeficient v točki $(3, 4)$. Pozor na minus pri $x = -3$.
~ -1,33 | To je naklon polmera do točke, $\frac{4}{-3}$. Tangenta je nanj pravokotna.
~ 1,33 | Obrnil si ulomek: $y' = -\frac{x}{y}$, ne $-\frac{y}{x}$.
> $y' = -\frac{x}{y} = -\frac{-3}{4} = \frac{3}{4} = 0{,}75$.

? (višja raven) Razvrsti korake pri iskanju tangente na implicitno podano krivuljo.
1. Preveri, da točka leži na krivulji.
2. Odvajaj obe strani enačbe po $x$, $y$ odvajaj po verižnem pravilu.
3. Iz dobljene enačbe izrazi $y'$.
4. Vstavi koordinati točke in dobiš smerni koeficient $k$.
5. Zapiši tangento $y - y_0 = k(x - x_0)$.
> Najprej odvajaj, nato vstavi. Če točko vstaviš pred odvajanjem, dobiš le konstanto in odvoda ni.

<<RACUN
odvod: 8*exp(-0.5*(t-2)) | t | -4*exp(-0.5*(t-2))
vrednost: -4*exp(0) | -4
odvod: sqrt(25-x^2) | x | -x/sqrt(25-x^2)
enako: -3/4*(x-3)+4 | -3/4*x+25/4
resi: x^2+(-3/4*x+25/4)^2=25 | x | 3
vrednost: 16/25+1.8^2/9 | 1
vrednost: -9*4/(25*1.8) | -0.8
enako: -0.8*(x-4)+1.8 | -0.8*x+5
resi: x^2/25+(-4/5*x+5)^2/9=1 | x | 4
resi: x^2+(-4*x/3)^2=625 | x | -15, 15
resi: x^2+(3/4*x-125/4)^2=625 | x | 15
vrednost: -(2*1+2)/(1+2*2) | -0.8
resi: x^2+x*(-4/5*x+14/5)+(-4/5*x+14/5)^2=7 | x | 1
vrednost: -(-3)/4 | 0.75
odvod: x^2-4 | x | 2*x
vrednost: 4-0^2 | 4
vrednost: 3^2-4 | 5
>>

:::simboli
f | funkcija | | |
a | točka, v kateri preverjamo odvedljivost | | |
h | prirastek neodvisne spremenljivke | | |
f' | odvod funkcije $f$ | f'(a) = \lim_{h \to 0} \frac{f(a + h) - f(a)}{h} | |
x | neodvisna spremenljivka | | |
y | implicitno podana funkcija od $x$ | | | točka $(x, y)$ leži na krivulji
y' | odvod $y$ po $x$ | | | smerni koeficient tangente
c | koncentracija zdravila v krvi | | mg/L |
t | čas od začetka infuzije | | h |
k | smerni koeficient tangente | k = y'(x_0, y_0) | |
x_0, y_0 | koordinati dotikališča | | |
r | polmer krožnice | | mm |
:::
