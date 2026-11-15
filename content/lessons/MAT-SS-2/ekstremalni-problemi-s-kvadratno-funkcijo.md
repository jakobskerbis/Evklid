---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

*(višja raven) Ekstremalne probleme s kvadratno funkcijo matura preverja samo na višji ravni.*

Vstopnica za sobotno predstavo v planetariju stane $8\,€$ in vsako soboto jih prodajo $300$. Vodja razmišlja o podražitvi. Anketa med obiskovalci pokaže, da vsak evro podražitve odvrne $20$ ljudi. Pri $9\,€$ bi torej prišlo $280$ obiskovalcev, pri $12\,€$ le še $220$. Se podražitev splača? In če se, do katere cene?

Dve sili vlečeta v nasprotni smeri. Višja cena prinese več denarja od vsakega obiskovalca, a obiskovalcev je manj. Prihodek je zmnožek obeh, cena krat število ljudi, in tak zmnožek je pogosto kvadratna funkcija. Njeno teme pove najboljšo izbiro.

Enako vprašanje se skriva v ograji, s katero želiš ograditi čim večji prostor, ali v plošči, iz katere izrežeš čim večji pravokotnik. Takim nalogam pravimo **ekstremalni problemi** in so ena najpomembnejših uporab kvadratne funkcije.

## Razlaga

**1. Kaj je drugače kot doslej.** Največjo vrednost funkcije imenujemo **maksimum**, najmanjšo **minimum**, s skupno besedo **ekstrem**. V lekciji Kvadratna funkcija si iz temenske oblike $f(x) = a(x - p)^2 + q$ prebral: pri $a < 0$ je $q$ največja vrednost funkcije, pri $a > 0$ najmanjša. To ostane. Novo je vse, kar je okoli tega:

| | Doslej | Zdaj |
|---|---|---|
| predpis | dan | iz besedila |
| dovoljeni $x$ | vsi realni | po besedilu |
| ekstrem | v temenu | teme ali krajišče |
| odgovor | število $q$ | mere z enoto |

**2. Predpis iz besedila.** Začnimo z nalogo brez zgodbe: vsota dveh števil je $20$. Kdaj je njun zmnožek največji? Najprej poskusimo s številkami.

| $x$ | $20 - x$ | zmnožek |
|---|---|---|
| $2$ | $18$ | $36$ |
| $6$ | $14$ | $84$ |
| $10$ | $10$ | $100$ |
| $14$ | $6$ | $84$ |
| $18$ | $2$ | $36$ |

Zmnožek najprej raste, nato pada, vrednosti pa so simetrične okoli $x = 10$. Tak vzorec poznaš: to je parabola.

Za predpis eno število označimo z $x$. Pogoj »vsota je $20$« je **zveza** med obema številoma. Z njo izrazimo drugo število: $20 - x$. Zmnožek je zdaj funkcija ene same spremenljivke:

$$P(x) = x(20 - x) = -x^2 + 20x$$

Brez zveze bi ostali dve neznanki in kvadratne funkcije ne bi bilo.

**3. Ekstrem v temenu.** Predpis z dopolnjevanjem do popolnega kvadrata preoblikujemo v temensko obliko:

$$-x^2 + 20x = -(x^2 - 20x + 100) + 100$$

$$P(x) = -(x - 10)^2 + 100$$

Kvadrat $(x - 10)^2$ ni nikoli negativen, zato je $P(x) \le 100$. Enakost velja samo pri $x = 10$. Največji zmnožek je $100$, števili sta $10$ in $10$.

Isti $x$ dobiš hitreje: $p = -\dfrac{b}{2a} = -\dfrac{20}{2 \cdot (-1)} = 10$, ali kot sredino ničel $0$ in $20$. Dopolnjevanje pa hkrati dokaže, da gre res za največjo vrednost.

Pri $a > 0$ je parabola odprta navzgor in teme da **najmanjšo** vrednost. Predznak $a$ zato preveri, preden zapišeš »največ«.

:::premisli
Ali ima zmnožek dveh števil z vsoto $20$ tudi najmanjšo vrednost? Napovej, preden pogledaš.
---
Če sta števili poljubni realni števili, ne. Pri $x = 30$ je drugo število $-10$ in zmnožek $-300$; pri večjem $x$ je še manjši, brez meje. Če pa morata biti števili nenegativni, je $x \in [0, 20]$ in najmanjši zmnožek je $0$, v krajiščih $x = 0$ in $x = 20$. Odgovor je odvisen od tega, kateri $x$ so dovoljeni.
:::

**4. Pravokotnik z danim obsegom.** Ograda ima obliko pravokotnika z obsegom $40\,\text{m}$. Dolžina in širina skupaj merita polovico obsega, $20\,\text{m}$. Če je ena stranica $x$, je druga $20 - x$, ploščina pa je spet $P(x) = x(20 - x)$. Največja je pri $x = 10$: ograda je kvadrat $10\,\text{m} \times 10\,\text{m}$ s ploščino $100\,\text{m}^2$. Med vsemi pravokotniki z enakim obsegom ima največjo ploščino kvadrat.

**5. Dovoljeni $x$ in krajišča.** Zdaj naj ograda stoji na pasu zemljišča, širokem le $6\,\text{m}$. Stranica $x$ leži čez pas, zato meri največ $6\,\text{m}$, hkrati mora biti pozitivna. Besedilo tako določi **definicijsko območje** $(0, 6]$. Teme pri $x = 10$ leži zunaj njega: kvadrata $10 \times 10$ ni mogoče postaviti.

:::risba graf
opis: Parabola P(x) = x(20 − x) od x = 0 do x = 20 s temenom T(10, 100), narisana sivo in črtkano. Debelo je poudarjen samo del nad intervalom od 0 do 6, ki se konča v točki (6, 84). Navpična črtkana črta pri x = 6 kaže mejo širine pasu.
x: 0 .. 20 | 2 | x (m)
y: 0 .. 120 | 20 | P (m^2)
f: x*(20 - x) | siva črtkano | 0 .. 20
f: x*(20 - x) | modra debelo | 0 .. 6
črta: 6; 0 -> 6; 120 | oranžna črtkano
točka: 6; 84 | (6, 84) | levo | modra
točka: 10; 100 | T(10, 100) | nad desno
podnapis: Dovoljeni so le x do 6 m; teme leži zunaj
:::

Graf kaže, da je na $(0, 6]$ največja ploščina v desnem krajišču: $P(6) = 6 \cdot 14 = 84$. Ograda meri $6\,\text{m} \times 14\,\text{m}$, ploščina je $84\,\text{m}^2$.

:::premisli
Graf ni dokaz. Zakaj ni treba preveriti vseh $x$ med $0$ in $6$, ampak zadošča krajišče $x = 6$? In kaj bi dobil, če bi bil pas širok $12\,\text{m}$?
---
Funkcija $P$ ima $a = -1 < 0$, zato narašča povsod levo od temena $x = 10$. Ves interval $(0, 6]$ leži levo od $10$, torej je vsak večji $x$ boljši in najboljši je največji dovoljeni, $x = 6$. Pri meji $12\,\text{m}$ pa bi teme ležalo v območju in odgovor bi bil spet kvadrat $10 \times 10$.
:::

Splošno pravilo za zaprt interval $[m, n]$: izračunaj vrednost v temenu, če leži v intervalu, in v obeh krajiščih. Največja izmed njih je maksimum, najmanjša minimum. Krajišče, ki ni vključeno, ne more biti rešitev: pri nas mora biti $x > 0$, ker ograda s stranico $0$ ni ograda.

**6. Postopek.**

1. Izberi spremenljivko $x$ in zapiši, kaj pomeni in v kateri enoti.
2. Z zvezo iz besedila izrazi vse druge količine z $x$.
3. Zapiši funkcijo količine, ki jo iščeš (ploščina, prihodek, razdalja), in jo razvij.
4. Iz besedila določi definicijsko območje.
5. Poišči teme in preveri predznak $a$.
6. Če teme ni v območju, primerjaj vrednosti v krajiščih.
7. Odgovori na vprašanje naloge z enoto in preveri, ali je odgovor smiseln.

## Rešeni primeri

### Primer 1 (lažji): prostor za teleskope ob observatoriju

Astronomski krožek želi ob ravni steni observatorija ograditi pravokoten prostor za teleskope. Na voljo ima $40\,\text{m}$ ograje; ob steni ograje ne potrebuje. Kakšne naj bodo mere, da bo prostor čim večji?

**Podatki:** dolžina ograje $40\,\text{m}$; ena stranica pravokotnika leži ob steni, brez ograje
**Iščemo:** mere pravokotnika z največjo ploščino $P$ in to ploščino

:::formula
$P(x) = x(40 - 2x)$, kjer je $x$ stranica, pravokotna na steno; teme pri $p = -\dfrac{b}{2a}$
:::

**Rešitev:**

1. Z $x$ (v metrih) označimo stranici, pravokotni na steno. Ograja pokrije dve taki stranici in še tretjo, vzporedno s steno. Za tretjo ostane $40 - 2x$ metrov.
2. Ploščina: $P(x) = x(40 - 2x) = -2x^2 + 40x$.
3. Obe stranici morata biti pozitivni: $x > 0$ in $40 - 2x > 0$, torej $0 < x < 20$.
4. Teme: $p = -\dfrac{40}{2 \cdot (-2)} = 10$. Leži v območju, $a = -2 < 0$, zato je tu maksimum.
5. Stranica ob steni: $40 - 2 \cdot 10 = 20$; ploščina $P(10) = 10 \cdot 20 = 200$.
6. Odgovor: prostor naj sega $10\,\text{m}$ od stene in $20\,\text{m}$ vzdolž nje; ploščina je $200\,\text{m}^2$. To ni kvadrat. Stena »podari« eno stranico, zato se splača, da je stranica ob steni daljša.

### Primer 2 (srednji): sončna celica na krilu satelita

Krilo majhnega satelita je ploščica v obliki pravokotnega trikotnika s katetama $8\,\text{dm}$ in $6\,\text{dm}$. Nanjo nalepijo pravokotno sončno celico tako, da dve njeni stranici ležita na katetah, nasprotno oglišče pa na hipotenuzi. Pri katerih merah ima celica največjo ploščino?

**Podatki:** kateti $8\,\text{dm}$ in $6\,\text{dm}$; pravokotnik ima dve stranici na katetah in eno oglišče na hipotenuzi
**Iščemo:** stranici celice $x$ in $y$ z največjo ploščino $P$

:::formula
podobna trikotnika: $\dfrac{y}{8 - x} = \dfrac{6}{8}$; ploščina $P = x \cdot y$
:::

:::risba skica
opis: Pravokotni trikotnik s pravim kotom spodaj levo, vodoravno kateto 8 dm in navpično kateto 6 dm. V njem je pravokotnik s spodnjo stranico x na vodoravni kateti in levo stranico y na navpični kateti; zgornje desno oglišče leži na hipotenuzi. Desno od pravokotnika ostane manjši pravokotni trikotnik s katetama 8 − x in y.
območje: -1,25; -1 .. 9; 7
enota: 30
lik: 0; 0 -> 8; 0 -> 0; 6 | modra
pravokotnik: 0; 0 .. 3; 3,75 | oranžna ozadje
črta: 3; 0 -> 3; 3,75 | zelena črtkano
pravikot: 0; 0 | 1; 0 | 0; 1
napis: 1,5; 0 | x | pod
napis: 5,5; 0 | 8 − x | pod
napis: 0; 1,9 | y | levo
napis: 0; 5 | 6 dm | levo
napis: 4,5; 3,4 | hipotenuza | desno
:::

**Rešitev:**

1. Stranico na daljši kateti označimo z $x$ (v dm), drugo z $y$. Desno od celice ostane pravokotni trikotnik s katetama $8 - x$ in $y$. Ima enake kote kot cela ploščica, zato ji je podoben: $\dfrac{y}{8 - x} = \dfrac{6}{8}$.
2. Od tod $y = \dfrac{3}{4}(8 - x) = 6 - \dfrac{3}{4}x$. Zveza med $x$ in $y$ je zdaj zapisana.
3. Ploščina: $P(x) = x\left(6 - \dfrac{3}{4}x\right) = -\dfrac{3}{4}x^2 + 6x$. Območje: $0 < x < 8$.
4. Ničli funkcije sta $0$ in $8$, teme leži na sredini: $p = \dfrac{0 + 8}{2} = 4$. Ker je $a = -\dfrac{3}{4} < 0$, je tam maksimum.
5. $y = 6 - \dfrac{3}{4} \cdot 4 = 3$ in $P(4) = 4 \cdot 3 = 12$.
6. Odgovor: celica naj meri $4\,\text{dm} \times 3\,\text{dm}$, njena ploščina je $12\,\text{dm}^2$. To je natanko polovica ploščice, ki ima $\dfrac{8 \cdot 6}{2} = 24\,\text{dm}^2$; stranici celice sta polovici katet.

### Primer 3 (težji): cena vstopnice v planetariju

Vrnimo se k planetariju iz uvoda. Pri ceni $8\,€$ pride $300$ obiskovalcev; vsak evro podražitve jih odvrne $20$, vsak evro pocenitve pa privabi $20$ novih.

a) Pri kateri ceni je sobotni prihodek največji?
b) Občina, ki planetarij sofinancira, dovoli ceno največ $10\,€$. Katero ceno naj izberejo zdaj?

**Podatki:** začetna cena $8\,€$ in $300$ obiskovalcev; $20$ obiskovalcev manj (več) na vsak evro podražitve (pocenitve); v b) cena največ $10\,€$
**Iščemo:** ceno $x$ z največjim prihodkom $R$ v a) in v b)

:::formula
$R(x) = x \cdot N(x)$, kjer je $N(x)$ število obiskovalcev pri ceni $x$
:::

**Rešitev:**

1. Pri ceni $x$ evrov je vstopnica za $x - 8$ evrov dražja, zato pride $N(x) = 300 - 20(x - 8) = 460 - 20x$ ljudi. Kontrola: $N(8) = 300$. Formula velja tudi za pocenitev: pri $x < 8$ je $x - 8 < 0$, zato pride več kot $300$ ljudi.
2. Prihodek: $R(x) = x(460 - 20x) = -20x^2 + 460x$.
3. Območje: cena ni negativna in obiskovalcev ni manj kot nič: $460 - 20x \ge 0$, torej $x \in [0, 23]$.
4. a) Teme: $p = -\dfrac{460}{2 \cdot (-20)} = 11{,}5$ leži v območju, $a < 0$ pomeni maksimum. Takrat pride $460 - 20 \cdot 11{,}5 = 230$ ljudi in $R(11{,}5) = 11{,}5 \cdot 230 = 2645$.
5. a) Zdaj zaslužijo $8 \cdot 300 = 2400$ evrov, s podražitvijo bi zaslužili $245\,€$ več.
6. b) Novo območje je $[0, 10]$ in teme $11{,}5$ leži zunaj. Ves interval je levo od temena, kjer $R$ narašča, zato je največji prihodek v krajišču $x = 10$.
7. b) $N(10) = 460 - 200 = 260$ in $R(10) = 10 \cdot 260 = 2600$. V drugem krajišču je $R(0) = 0$, kar je manj.
8. Odgovor: brez omejitve je najboljša cena $11{,}50\,€$ s prihodkom $2645\,€$. Z omejitvijo naj izberejo največjo dovoljeno ceno, $10\,€$, in zaslužijo $2600\,€$. Model je le približek: »$20$ ljudi na evro« ne velja za poljubno ceno.

### Primer 4 – zdaj ti

Dve števili se razlikujeta za $8$. Kateri sta, če je njun zmnožek najmanjši možen?

**Podatki:** razlika števil je $8$; števili sta poljubni realni števili
**Iščemo:** števili z najmanjšim zmnožkom $P$ in ta zmnožek

:::formula
$P(x) = x(x + 8)$; temenska oblika z dopolnjevanjem do popolnega kvadrata
:::

**Rešitev:**

1. Manjše število označimo z $x$, večje je $x + 8$. Zmnožek: $P(x) = x(x + 8) = x^2 + 8x$.
2. Območje so vsa realna števila. Ker je $a = 1 > 0$, je parabola odprta navzgor in teme da najmanjšo vrednost.
3. Dopolni do popolnega kvadrata (polovica od $8$ je $4$) in sam preberi teme.

:::premisli
Kakšna je temenska oblika, kateri sta števili in kolikšen je najmanjši zmnožek?
---
$x^2 + 8x = (x + 4)^2 - 16$, teme je $T(-4, -16)$. Števili sta $-4$ in $4$, najmanjši zmnožek je $-16$. Negativen je, ker imata števili različna predznaka.
:::

## Pogoste napake

- **Teme brez pogleda na območje.** »Maksimum je v temenu« velja le, če teme leži med dovoljenimi $x$. V Primeru 3 b) bi cena $11{,}50\,€$ kršila omejitev. Najprej zapiši območje, nato preveri, ali teme leži v njem; če ne, izračunaj vrednosti v krajiščih.
- **Dve neznanki v predpisu.** $P = x \cdot y$ ni funkcija ene spremenljivke, zato temena ne moreš izračunati. Zvezo (vsota, obseg, dolžina ograje, podobnost) uporabi, da $y$ izraziš z $x$.
- **Napačna zveza.** Pri obsegu $40\,\text{m}$ stranici nista $x$ in $40 - x$, ampak $x$ in $20 - x$, ker obseg šteje vsako stranico dvakrat. Pri ograji ob steni pa ograja pokrije le tri stranice. Nariši skico in na vsako stranico napiši njeno dolžino z $x$.
- **»V temenu je vedno največ.«** Pri $a > 0$ je v temenu najmanjša vrednost, največje pa na vseh realnih številih sploh ni. Predznak $a$ preveri vsakič.
- **Tabela namesto dokaza.** Iz $P(9) < P(10)$ in $P(11) < P(10)$ še ne sledi, da je $10$ najboljši: med števili, ki jih nisi poskusil, bi lahko bilo boljše. Dokaz da temenska oblika $P(x) = -(x - 10)^2 + 100$ ali formula za teme skupaj s predznakom $a$.

## Povzetek

- Ekstremalni problem: iščemo največjo (maksimum) ali najmanjšo (minimum) vrednost količine, npr. ploščine, prihodka ali zmnožka.
- Spremenljivko $x$ izberemo sami. Z zvezo (vsota, obseg, dolžina ograje, podobnost) izrazimo druge količine z $x$ in dobimo kvadratno funkcijo.
- Definicijsko območje določi besedilo: dolžine so pozitivne, število ljudi nenegativno, lahko so dodane omejitve.
- Ekstrem je v temenu, $p = -\dfrac{b}{2a}$ ali iz temenske oblike: maksimum pri $a < 0$, minimum pri $a > 0$.
- Če teme ni v območju, je ekstrem v krajišču. Na $[m, n]$ primerjamo vrednosti v temenu in v obeh krajiščih.
- Med pravokotniki z enakim obsegom ima največjo ploščino kvadrat. Pri ograji ob steni je stranica ob steni dvakrat daljša od drugih dveh.
- Odgovor so mere, cena ali čas z enoto, ne le vrednost $q$.

## Ponovitev

*(višja raven)*

**Formule**
- teme: $p = -\dfrac{b}{2a}$, $q = f(p)$ (na pamet)
- temenska oblika $f(x) = a(x - p)^2 + q$ (na pamet)
- $a < 0$: maksimum $q$; $a > 0$: minimum $q$ (na pamet)
- na $[m, n]$: primerjaj $f(p)$, $f(m)$, $f(n)$ (na pamet)

**Postopek**
1. Nariši skico in vsako dolžino zapiši z $x$.
2. Z zvezo (obseg, vsota, ograja) izrazi drugo količino z $x$.
3. Sestavi kvadratno funkcijo in iz besedila zapiši območje za $x$.
4. Izračunaj teme in preveri, ali leži v območju.
5. Če ne, izračunaj vrednosti v krajiščih.
6. Odgovori z merami in enoto, ne le z $q$.

**Pazi na**
- Teme upoštevaj le, če leži v območju; sicer je ekstrem v krajišču.
- Pri obsegu $40\,\text{m}$ sta stranici $x$ in $20 - x$, ne $40 - x$.
- Pri $a > 0$ je v temenu minimum, ne maksimum.

## Za maturo

### Naloga 1 (višja raven): krajša strukturirana naloga, 7 točk, pola 2 (z računalom)

Mali rastlinjak ima obliko kvadra s kvadratnim dnom. Vseh $12$ robov je iz aluminijastega profila, ki ga je skupaj $6\,\text{m}$. Štiri stranske ploskve in zgornja ploskev so iz stekla, dno ni. Rob dna označimo z $x$, višino rastlinjaka s $h$, oboje v metrih, ploščino stekla pa z $S$.

a) Izrazi $h$ z $x$, pokaži, da je $S(x) = -7x^2 + 6x$, in zapiši, za katere $x$ je model smiseln. (3 točke)
b) Izračunaj $x$, pri katerem je stekla največ, in to ploščino. Rezultata zaokroži na dve decimalki. (2 točki)
c) Rastlinjak mora stati na okenski polici, globoki $35\,\text{cm}$, zato je $x \le 0{,}35$. Izračunaj zdaj največjo ploščino stekla in višino rastlinjaka. (2 točki)

**Rešitev:**

1. a) Dno in zgornja ploskev imata skupaj $8$ robov dolžine $x$, navpičnih robov dolžine $h$ je $4$. Iz $8x + 4h = 6$ sledi $h = 1{,}5 - 2x$.
2. a) Steklo sestavljajo zgornja ploskev $x^2$ in štiri stranske ploskve $xh$, zato $S(x) = x^2 + 4x(1{,}5 - 2x) = x^2 + 6x - 8x^2 = -7x^2 + 6x$.
3. a) Mora biti $x > 0$ in $h > 0$, torej $1{,}5 - 2x > 0$ oziroma $x < 0{,}75$. Model je smiseln za $0 < x < 0{,}75$.
4. b) Vodilni koeficient $-7$ je negativen, zato je v temenu maksimum. Teme: $x = -\dfrac{6}{2 \cdot (-7)} = \dfrac{3}{7} = 0{,}42857\ldots$, kar leži v območju; $x \doteq 0{,}43\,\text{m}$.
5. b) Največja ploščina: $S\left(\dfrac{3}{7}\right) = \dfrac{9}{7} = 1{,}28571\ldots$, torej $S \doteq 1{,}29\,\text{m}^2$.
6. c) Interval $(0; 0{,}35]$ leži levo od temena $0{,}43$, kjer $S$ narašča, saj je parabola odprta navzdol. Največja ploščina je zato v krajišču $x = 0{,}35$: $S(0{,}35) = -7 \cdot 0{,}1225 + 2{,}1 = 1{,}2425$, torej $S \doteq 1{,}24\,\text{m}^2$.
7. c) Višina: $h = 1{,}5 - 2 \cdot 0{,}35 = 0{,}8\,\text{m}$.
8. Odgovor: model je smiseln za $0 < x < 0{,}75$; največ stekla, $1{,}29\,\text{m}^2$, ima rastlinjak z robom dna $0{,}43\,\text{m}$; na polici ima največ $1{,}24\,\text{m}^2$ stekla pri robu dna $0{,}35\,\text{m}$ in višini $0{,}8\,\text{m}$.

**Točkovanje:** a) 1 točka za $h = 1{,}5 - 2x$, 1 točka za izpeljavo $S(x)$, 1 točka za $0 < x < 0{,}75$; b) 1 točka za $x \doteq 0{,}43\,\text{m}$ z utemeljitvijo maksimuma, 1 točka za $S \doteq 1{,}29\,\text{m}^2$; c) 1 točka za utemeljitev, da je največja ploščina v desnem krajišču intervala, 1 točka za $S \doteq 1{,}24\,\text{m}^2$ in $h = 0{,}8\,\text{m}$.

### Naloga 2 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Dve ravni cesti se sekata pod pravim kotom v križišču $K$. Ob času $t = 0$ je kolesar A $10\,\text{km}$ severno od $K$ in pelje proti $K$ s stalno hitrostjo $12\,\text{km/h}$. Kolesar B je ob času $t = 0$ v $K$ in pelje proti vzhodu s stalno hitrostjo $16\,\text{km/h}$. Čas $t$ merimo v urah, razdaljo med kolesarjema $d$ v kilometrih.

a) Pokaži, da je $d^2 = 400t^2 - 240t + 100$, in zapiši interval časov od začetka, dokler kolesar A ne pride do križišča. (3 točke)
b) Kdaj sta si kolesarja najbližje in kolikšna je takrat razdalja med njima? Utemelji, zakaj zadošča poiskati najmanjšo vrednost $d^2$. (3 točke)
c) Kdaj sta kolesarja spet $10\,\text{km}$ narazen, tako kot ob začetku? (2 točki)
d) Kolesar A po $12$ minutah zavije s ceste. Kolikšna je najmanjša razdalja med kolesarjema od $t = 0$ do tega trenutka? (2 točki)

**Rešitev:**

1. a) Po $t$ urah je A od $K$ oddaljen $10 - 12t$ kilometrov, B pa $16t$ kilometrov. Cesti sta pravokotni, zato po Pitagorovem izreku $d^2 = (10 - 12t)^2 + (16t)^2$.
2. a) Razvijemo: $d^2 = 100 - 240t + 144t^2 + 256t^2 = 400t^2 - 240t + 100$.
3. a) A pride v $K$, ko je $10 - 12t = 0$, torej pri $t = \dfrac{5}{6}$. Interval je $\left[0, \dfrac{5}{6}\right]$.
4. b) Razdalja je nenegativna in $d = \sqrt{d^2}$, koren pa je naraščajoča funkcija. Zato je $d$ najmanjša natanko takrat, ko je najmanjši $d^2$.
5. b) Teme: $t = -\dfrac{-240}{2 \cdot 400} = 0{,}3$. Leži v intervalu, $a = 400 > 0$ pomeni minimum. To je po $18$ minutah.
6. b) $d^2 = 400 \cdot 0{,}09 - 240 \cdot 0{,}3 + 100 = 36 - 72 + 100 = 64$, torej $d = 8\,\text{km}$.
7. c) Iz $400t^2 - 240t + 100 = 100$ sledi $400t^2 - 240t = 0$ oziroma $80t(5t - 3) = 0$. Rešitvi sta $t = 0$ (začetek) in $t = 0{,}6$, ki leži v intervalu; to je po $36$ minutah.
8. d) $12$ minut je $0{,}2$ ure. Interval $[0; 0{,}2]$ leži levo od temena $0{,}3$, kjer funkcija $d^2$ s pozitivnim vodilnim koeficientom pada. Najmanjša vrednost je zato v krajišču $t = 0{,}2$.
9. d) $d^2 = 400 \cdot 0{,}04 - 240 \cdot 0{,}2 + 100 = 16 - 48 + 100 = 68$, torej $d = \sqrt{68} = 2\sqrt{17}\,\text{km}$.
10. Odgovor: najbližje sta si po $18$ minutah, $8\,\text{km}$; spet $10\,\text{km}$ narazen sta po $36$ minutah; če A zavije po $12$ minutah, je najmanjša razdalja $2\sqrt{17}\,\text{km}$, ob trenutku, ko zavije.

**Točkovanje:** a) 1 točka za razdalji $10 - 12t$ in $16t$, 1 točka za Pitagorov izrek in razvit $d^2$, 1 točka za interval $\left[0, \frac{5}{6}\right]$; b) 1 točka za utemeljitev z $d^2$, 1 točka za $t = 0{,}3$ (18 minut) z utemeljitvijo minimuma, 1 točka za $d = 8\,\text{km}$; c) 1 točka za enačbo $400t^2 - 240t = 0$, 1 točka za $t = 0{,}6$ (36 minut); d) 1 točka za utemeljitev, da je minimum v krajišču $t = 0{,}2$; 1 točka za $d = 2\sqrt{17}\,\text{km}$.

### Ustno vprašanje 1

:::premisli
(višja raven) Opiši, kako rešimo ekstremalni problem s kvadratno funkcijo, in pojasni vlogo definicijskega območja.
---
Izberemo spremenljivko in z zvezo iz besedila izrazimo vse druge količine z njo. Količino, ki jo optimiziramo, zapišemo kot kvadratno funkcijo $f(x) = ax^2 + bx + c$. Iz besedila določimo definicijsko območje, na primer da so dolžine pozitivne. Ekstrem iščemo v temenu $p = -\frac{b}{2a}$, ki je maksimum pri $a < 0$ in minimum pri $a > 0$. Če teme ne leži v definicijskem območju, je ekstrem v krajišču območja, zato primerjamo vrednosti v krajiščih.
:::

### Ustno vprašanje 2

:::premisli
(višja raven) Dokaži, da ima med vsemi pravokotniki z enakim obsegom največjo ploščino kvadrat.
---
Naj bo obseg $2s$, torej je vsota dolžine in širine $s$, stranici pa sta $x$ in $s - x$. Ploščina je $P(x) = x(s - x) = -x^2 + sx$. Z dopolnjevanjem do popolnega kvadrata dobimo $P(x) = \frac{s^2}{4} - \left(x - \frac{s}{2}\right)^2$. Ker kvadrat ni negativen, je $P(x) \le \frac{s^2}{4}$, enakost pa velja le pri $x = \frac{s}{2}$. Takrat je tudi druga stranica $\frac{s}{2}$, zato je pravokotnik kvadrat.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Pojasni, zakaj največja vrednost kvadratne funkcije na zaprtem intervalu ni vedno v temenu, in navedi primer.
---
Na zaprtem intervalu, ki ne vsebuje temena, je kvadratna funkcija monotona, saj na vsaki strani temena le narašča ali le pada. Monotona funkcija ima največjo in najmanjšo vrednost v krajiščih intervala. Pri $a > 0$ je v temenu celo najmanjša vrednost, zato je največja vrednost na zaprtem intervalu vedno v enem od krajišč. Funkcija $f(x) = -x^2 + 4x$ ima na primer teme pri $x = 2$, na intervalu $[3, 5]$ pa pada. Njena največja vrednost na tem intervalu je zato $f(3) = 3$, najmanjša pa $f(5) = -5$.
:::

## Drugače: Na sliki

Pravokotnikov z obsegom $20\,\text{cm}$ je neskončno. Trije med njimi:

:::risba skica
opis: Trije pravokotniki z obsegom 20 cm drug ob drugem. Prvi je podolgovat, 9 cm × 1 cm, s ploščino 9 cm². Drugi meri 7 cm × 3 cm, ploščina 21 cm². Tretji je kvadrat 5 cm × 5 cm s ploščino 25 cm².
območje: 0; -1 .. 24; 7
enota: 12
pravokotnik: 0; 0 .. 9; 1 | modra ozadje
pravokotnik: 10; 0 .. 17; 3 | modra ozadje
pravokotnik: 18; 0 .. 23; 5 | oranžna ozadje
napis: 4,5; 1 | 9 · 1 = 9 | nad
napis: 13,5; 3 | 7 · 3 = 21 | nad
napis: 20,5; 5 | 5 · 5 = 25 | nad
:::

Ograja je vedno enako dolga, prostora pa je v kvadratu skoraj trikrat več kot v ozkem traku. Vsak pravokotnik je ena točka na paraboli $P(x) = x(10 - x)$:

:::risba graf
opis: Parabola P(x) = x(10 − x) za pravokotnike z obsegom 20 cm, s temenom (5, 25). V aplikaciji drsnik izbere stranico x; izbrano je x = {s} cm, druga stranica meri {10 - s} cm, ploščina je {s*(10 - s)} cm². Navpična črtkana črta vodi od osi x do te točke na paraboli.
x: 0 .. 10 | 1 | x (cm)
y: 0 .. 30 | 5 | P (cm^2)
drsnik: s | 0,5 .. 9,5 | 0,5 | 3 | stranica x
f: x*(10 - x) | modra | 0 .. 10
črta: s; 0 -> s; s*(10 - s) | siva črtkano
točka: s; s*(10 - s) | {s*(10 - s)} | nad
podnapis: Pravokotnik {s} cm × {10 - s} cm ima ploščino {s*(10 - s)} cm²
:::

V aplikaciji premikaj drsnik od leve proti desni. Točka se vzpenja, dokler pravokotnik ne postane kvadrat, nato se spušča. Opazi še, da $x = 3$ in $x = 7$ dasta enako visoko točko: pravokotnik $3 \times 7$ je isti kot $7 \times 3$, le zasukan. Zato je parabola simetrična okoli $x = 5$.

## Drugače: Iz vsakdanjega življenja

Kadar je rezultat zmnožek dveh količin in ena raste, ko druga pada, je najboljša izbira nekje vmes. Skrajnosti so slabe na obeh straneh.

- **Vstopnice.** Pri ceni $0\,€$ je dvorana polna, zaslužek pa nič. Pri previsoki ceni ne pride nihče. Nekje vmes je cena z največjim prihodkom, v planetariju $11{,}50\,€$.
- **Sadovnjak.** Sadjar ima $20$ jablan, vsaka da $300$ jabolk. Vsaka dodatna jablana zasenči druge, zato da vsako drevo $10$ jabolk manj. Pri $x$ dodatnih drevesih je pridelek $(20 + x)(300 - 10x)$. Največji je pri $x = 5$: $25$ dreves po $250$ jabolk, skupaj $6250$ namesto $6000$.
- **Ograda.** Iz enake ograje je ozek trak skoraj brez prostora, kvadrat pa ponudi največ.

V vseh treh primerih en faktor pridobi, kar drugi izgubi. Teme parabole je točka ravnovesja.

## Preveri se

? Zakaj ima zmnožek $P(x) = x(20 - x)$ največjo vrednost ravno pri $x = 10$?
- Ker sta $P(9) = 99$ in $P(11) = 99$ manjša od $P(10) = 100$.
~ Primerjava z dvema sosedoma ne izključi, da bi bil kakšen drug $x$ še boljši. Dokaz da šele temenska oblika.
+ Ker je $P(x) = 100 - (x - 10)^2$, kvadrat pa je najmanjši, enak $0$, pri $x = 10$.
- Ker je $10$ ničla funkcije $P$.
~ Ničli sta $0$ in $20$, tam je zmnožek $0$. Teme leži na sredini med ničlama.
> $(x - 10)^2 \ge 0$, zato je $P(x) \le 100$, enakost pa velja le pri $x = 10$.

? Zaslužek krožka od prodaje koledarjev z astrofotografijami opisuje funkcija $Z(x) = -(x - 8)^2 + 64$ (v evrih), kjer je $x$ cena koledarja v evrih. Šola dovoli ceno od $2\,€$ do $6\,€$. Z grafa preberi, pri kateri ceni je zaslužek največji.
:::risba graf
opis: Parabola Z(x) = −(x − 8)² + 64, odprta navzdol, s temenom T(8, 64), narisana sivo in črtkano od x = 0 do x = 12. Debelo je poudarjen samo dovoljeni del od x = 2 do x = 6, od točke (2, 28) do točke (6, 60).
x: 0 .. 12 | 2 | cena (€)
y: 0 .. 80 | 10 | Z (€)
f: -(x - 8)^2 + 64 | siva črtkano | 0 .. 12
f: -(x - 8)^2 + 64 | modra debelo | 2 .. 6
točka: 2; 28 | (2, 28) | desno | modra
točka: 6; 60 | (6, 60) | pod desno | modra
točka: 8; 64 | T(8, 64) | nad
:::
- Pri $8\,€$, zaslužek $64\,€$.
~ To je teme, cena $8\,€$ pa ni dovoljena. Na dovoljenem delu grafa poišči najvišjo točko.
+ Pri $6\,€$, zaslužek $60\,€$.
- Pri $2\,€$, zaslužek $28\,€$.
~ Na intervalu $[2, 6]$ zaslužek narašča, zato je pri $2\,€$ najmanjši, ne največji.
> Interval $[2, 6]$ leži levo od temena, kjer parabola, odprta navzdol, narašča. Največji zaslužek je v desnem krajišču: $Z(6) = 60$.

? (brez računala) Med vsemi pravokotniki z istim obsegom ima največji ploščino $81\,\text{cm}^2$. Kolikšen je ta obseg?
= 36 cm
~ 18 | To je vsota dolžine in širine, $9 + 9$, torej polovica obsega. Obseg šteje vsako stranico dvakrat.
~ 20,25 | Ploščino si delil s $4$. Največjo ploščino ima kvadrat, njegova stranica je $\sqrt{81} = 9$.
~ 9 | To je stranica kvadrata, ne obseg.
> Največjo ploščino ima kvadrat: $a^2 = 81$, $a = 9\,\text{cm}$, obseg je $4 \cdot 9 = 36\,\text{cm}$.

? Iz ploščice v obliki pravokotnega trikotnika s katetama $1{,}5\,\text{m}$ in $0{,}9\,\text{m}$ izrežejo pravokotnik, ki ima dve stranici na katetah in oglišče na hipotenuzi. Izračunaj največjo ploščino pravokotnika v $\text{m}^2$ in jo zaokroži na stotinko.
= 0,34 m² | 0,01
~ 0,68 | To je ploščina celega trikotnika. Največji pravokotnik pokrije le njeno polovico.
~ 1,35 | To je zmnožek katet, dvakratna ploščina trikotnika.
> Kot pri sončni celici: stranici sta polovici katet, $0{,}75\,\text{m}$ in $0{,}45\,\text{m}$, ploščina je $0{,}75 \cdot 0{,}45 = 0{,}3375$, približno $0{,}34\,\text{m}^2$.

? Vsota dveh realnih števil je $10$. Pri katerem prvem številu $x$ je vsota njunih kvadratov $x^2 + (10 - x)^2$ najmanjša?
- Pri $x = 0$ ali $x = 10$, ko je eno od števil nič.
~ Tam je vsota kvadratov $100$, pri $x = 5$ pa le $50$. Krajišča preverjaš, kadar teme ni v območju; tu so dovoljena vsa realna števila.
+ Pri $x = 5$.
- Najmanjše vrednosti ni, funkcija ima le največjo.
~ Funkcija $2x^2 - 20x + 100$ ima $a = 2 > 0$. Parabola je odprta navzgor, v temenu ima najmanjšo vrednost, največje pa nima.
> $x^2 + (10 - x)^2 = 2x^2 - 20x + 100 = 2(x - 5)^2 + 50$, najmanjša vrednost je $50$ pri $x = 5$.

:::simboli
x | spremenljivka naloge | | | stranica, prvo število ali cena; pomen določi naloga
P | ploščina oziroma zmnožek | | | v razlagi $P(x) = x(20 - x)$
p | prva koordinata temena | p = -\frac{b}{2a} | | tu je ekstrem
q | druga koordinata temena | | | največja ali najmanjša vrednost
a | vodilni koeficient | | | $a < 0$: maksimum, $a > 0$: minimum
b | linearni koeficient | | |
y | druga stranica sončne celice | y = 6 - \frac{3}{4}x | dm | v Primeru 2
R | prihodek planetarija | R = x \cdot N | € | v Primeru 3; $x$ je cena v €
N | število obiskovalcev | N = 460 - 20x | – | v Primeru 3
Z | zaslužek krožka | | € | v kvizu
S | ploščina stekla rastlinjaka | S = -7x^2 + 6x | m^2 | v nalogi za maturo; $x$ je rob dna v m
h | višina rastlinjaka | h = 1{,}5 - 2x | m | v nalogi za maturo
t | čas | | h | v nalogi za maturo
d | razdalja med kolesarjema | | km | v nalogi za maturo
:::

<<RACUN
enako: x*(20-x) | -x^2+20*x
enako: -x^2+20*x | -(x-10)^2+100
vrednost: 30*(20-30) | -300
vrednost: 6*(20-6) | 84
enako: x*(40-2*x) | -2*x^2+40*x
neenacba: x*(40-2*x)>0 | x | (0, 20)
vrednost: -40/(2*(-2)) | 10
vrednost: 10*(40-2*10) | 200
resi: y/(8-x)=6/8 | y | 6-3*x/4
enako: x*(6-3*x/4) | -3*x^2/4+6*x
vrednost: -6/(2*(-3/4)) | 4
vrednost: 4*(6-3*4/4) | 12
enako: 300-20*(x-8) | 460-20*x
enako: x*(460-20*x) | -20*x^2+460*x
vrednost: -460/(2*(-20)) | 11.5
vrednost: 11.5*(460-20*11.5) | 2645
vrednost: 11.5*230-8*300 | 245
vrednost: 10*(460-20*10) | 2600
enako: x^2+8*x | (x+4)^2-16
vrednost: -(6-8)^2+64 | 60
vrednost: -(2-8)^2+64 | 28
vrednost: 4*sqrt(81) | 36
vrednost: 1.5*0.9/4 | 0.3375
enako: x^2+(10-x)^2 | 2*(x-5)^2+50
resi: 8*x+4*h=6 | h | 3/2-2*x
enako: x^2+4*x*(3/2-2*x) | -7*x^2+6*x
neenacba: x*(3/2-2*x)>0 | x | (0, 3/4)
vrednost: -6/(2*(-7)) | 0.42857
vrednost: -7*(3/7)^2+6*(3/7) | 9/7
vrednost: -7*0.35^2+6*0.35 | 1.2425
vrednost: 1.5-2*0.35 | 0.8
enako: (20+x)*(300-10*x) | -10*(x-5)^2+6250
vrednost: 25*250 | 6250
enako: (10-12*t)^2+(16*t)^2 | 400*t^2-240*t+100
vrednost: 240/800 | 0.3
vrednost: 400*0.3^2-240*0.3+100 | 64
resi: 400*t^2-240*t+100=100 | t | 0, 0.6
vrednost: sqrt(400*0.2^2-240*0.2+100) | 2*sqrt(17)
vrednost: -(3)^2+4*3 | 3
vrednost: -(5)^2+4*5 | -5
>>
