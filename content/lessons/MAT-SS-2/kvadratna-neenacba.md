---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Cesta čez gorski prelaz je na zemljevidu skoraj ravna črta, njen višinski profil pa je lok. Izhodišče postavimo na vrh prelaza. Z $x$ označimo vodoravno oddaljenost od vrha v kilometrih: vzhodno je $x$ pozitiven, zahodno negativen. Nadmorska višina ceste je približno $h(x) = 1600 - 25x^2$ metrov (model velja za $-6 \le x \le 6$). Snežna meja je na $1200\,\text{m}$. Na katerem delu ceste pozimi potrebuješ verige?

Sošolec računa kot pri enačbi: $1600 - 25x^2 > 1200$, torej $25x^2 < 400$ in $x^2 < 16$. Nato »koreni« in dobi $x < 4$. Vsak korak se zdi pravilen. Po tem rezultatu pa bi bila nad snežno mejo tudi točka $x = -6$, šest kilometrov zahodno od prelaza. Tam je cesta na višini $h(-6) = 700\,\text{m}$, globoko pod mejo. Kje se je zalomilo?

Vprašanje »kje je količina večja ali manjša od dane vrednosti« vodi do **kvadratne neenačbe**. Rešili jo bomo **z grafom**: parabola sama pokaže, kje je kvadratna funkcija pozitivna in kje negativna.

## Razlaga

**1. Najprej rešimo prelaz.** Vse člene prenesemo na levo: $1600 - 25x^2 - 1200 > 0$, torej $400 - 25x^2 > 0$. Vprašanje se zdaj glasi: kje je graf funkcije $f(x) = 400 - 25x^2$ **nad osjo $x$**?

Ničli dobimo iz enačbe $400 - 25x^2 = 0$: $x^2 = 16$, torej $x_1 = -4$ in $x_2 = 4$. Vodilni koeficient je $-25 < 0$, zato je parabola odprta navzdol. Med ničlama je nad osjo, levo in desno od njiju pa pod njo. Ničli razdelita os $x$ na tri dele; v vsakem preverimo po eno število:

| del osi | preizkus | predznak |
|---|---|---|
| $x < -4$ | $f(-5) = -225$ | $-$ |
| $-4 < x < 4$ | $f(0) = 400$ | $+$ |
| $x > 4$ | $f(5) = -225$ | $-$ |

Rešitev je $x \in (-4, 4)$: nad snežno mejo je $8\,\text{km}$ ceste, po štiri na vsaki strani vrha. Sošolec je pozabil, da je $\sqrt{x^2} = |x|$. Iz $x^2 < 16$ sledi $|x| < 4$, torej $-4 < x < 4$, ne le $x < 4$.

:::premisli
Kaj pa, če bi bila snežna meja na $1700\,\text{m}$? Napovej rešitev, preden računaš.
---
Rešitve ni. Najvišja točka ceste je vrh prelaza na $1600\,\text{m}$. Neenačba $1600 - 25x^2 > 1700$ da $-25x^2 - 100 > 0$; parabola $-25x^2 - 100$ je odprta navzdol z vrhom pri $-100$, zato je ves graf pod osjo.
:::

**2. Definicija.** Kvadratna neenačba je neenačba, ki jo lahko preoblikujemo v eno od oblik

$$ax^2 + bx + c > 0, \quad ax^2 + bx + c \ge 0,$$

$$ax^2 + bx + c < 0, \quad ax^2 + bx + c \le 0,$$

kjer so $a, b, c$ realna števila in $a \ne 0$. **Rešitev** neenačbe je množica vseh realnih števil $x$, za katera neenačba velja. Navadno jo zapišemo z intervali ali z unijo intervalov.

**3. Ključna ideja.** Označimo $f(x) = ax^2 + bx + c$. Neenačba $f(x) > 0$ sprašuje, kje je graf funkcije $f$ **nad osjo $x$**, neenačba $f(x) < 0$ pa, kje je graf **pod osjo $x$**. Pri neenačbah z $\ge$ in $\le$ dodamo še točke, kjer graf os $x$ seka ali se je dotakne, torej ničle.

**4. Postopek reševanja z grafom.**

1. Neenačbo preoblikuj tako, da je na desni strani $0$: vse člene prenesi na levo in jih uredi.
2. Poišči ničle funkcije $f(x) = ax^2 + bx + c$ (diskriminanta $D = b^2 - 4ac$ in obrazec $x_{1,2} = \dfrac{-b \pm \sqrt{D}}{2a}$).
3. Nariši skico parabole: ničle označi na osi $x$, po predznaku $a$ ugotovi, ali je parabola odprta navzgor ($a > 0$) ali navzdol ($a < 0$). Teme in natančna oblika niso potrebni.
4. Na skici preberi, kje je parabola nad osjo $x$ oziroma pod njo.
5. Rešitev zapiši z intervali. Pri ostrem neenačaju ($>$, $<$) ničle **niso** del rešitve (okrogli oklepaj), pri neostrem ($\ge$, $\le$) **so** (oglati oklepaj).

**5. Primer $a > 0$ in $D > 0$.** Parabola je odprta navzgor in seka os $x$ v ničlah $x_1 < x_2$. Med ničlama je pod osjo, zunaj njiju pa nad osjo:

| Neenačba | Rešitev |
|---|---|
| $f(x) > 0$ | $(-\infty, x_1) \cup (x_2, \infty)$ |
| $f(x) \ge 0$ | $(-\infty, x_1] \cup [x_2, \infty)$ |
| $f(x) < 0$ | $(x_1, x_2)$ |
| $f(x) \le 0$ | $[x_1, x_2]$ |

**6. Primer $D = 0$.** Parabola se osi $x$ le dotakne v eni točki (teme leži na osi). Za $a > 0$ je graf povsod drugje nad osjo. Za $f(x) = (x - 2)^2$ dobimo: $f(x) > 0$ za $x \in \mathbb{R} \setminus \{2\}$, $f(x) \ge 0$ za vse $x \in \mathbb{R}$, $f(x) < 0$ nima rešitve ($\emptyset$), $f(x) \le 0$ pa velja le za $x = 2$, torej je rešitev $\{2\}$.

**7. Primer $D < 0$.** Parabola nima realnih ničel in osi $x$ ne doseže. Pri $a > 0$ je ves graf nad osjo, zato je $f(x) > 0$ (in $f(x) \ge 0$) izpolnjena za vse $x \in \mathbb{R}$, neenačbi $f(x) < 0$ in $f(x) \le 0$ pa nimata rešitve. Pri $a < 0$ je ravno obratno.

V simulaciji spodaj (»Kvadratna neenačba«) nastavi $a = 1$, $b = -4$ in znak »$< 0$«, nato povečuj $c$ od $0$ do $6$. Opazuj odsek osi $x$, ki označuje rešitev: pri $c = 3$ je to interval $(1, 3)$, z večjim $c$ se krči, pri $c = 4$ (ko je $D = 0$) izgine. Pri znaku »$\le 0$« ostane pri $c = 4$ ena sama točka.

**8. Ko je $a < 0$.** Parabola je odprta navzdol, zato je **med** ničlama nad osjo, zunaj njiju pod osjo. Lahko pa neenačbo najprej pomnožiš z $-1$ in dobiš pozitiven vodilni koeficient. Pri tem **obrni neenačaj**: iz $-x^2 + 4 > 0$ dobiš $x^2 - 4 < 0$.

:::premisli
Naj bo $a > 0$ in $D > 0$. Je lahko rešitev neenačbe $f(x) > 0$ en sam neomejen interval, na primer le $(x_2, \infty)$? Odgovori, preden pogledaš.
---
Ne more. Parabola, odprta navzgor, ima pod osjo le »dno« med ničlama. Njena kraka se na obeh straneh dvigata v neskončnost, zato je nad osjo levo od $x_1$ in desno od $x_2$, torej na dveh ločenih kosih.
:::

## Rešeni primeri

### Primer 1 (lažji)

Reši neenačbo $x^2 - x - 6 < 0$.

**Podatki:** neenačba $x^2 - x - 6 < 0$; koeficienti $a = 1$, $b = -1$, $c = -6$
**Iščemo:** množico vseh $x$, za katere neenačba velja

:::formula
$D = b^2 - 4ac$, $\; x_{1,2} = \dfrac{-b \pm \sqrt{D}}{2a}$; pri $a > 0$ je $f(x) < 0$ med ničlama.
:::

**Rešitev:**

1. Desna stran je že $0$. Diskriminanta: $D = (-1)^2 - 4 \cdot 1 \cdot (-6) = 1 + 24 = 25$.
2. Ničli: $x_{1,2} = \dfrac{1 \pm 5}{2}$, torej $x_1 = -2$ in $x_2 = 3$.
3. Ker je $a = 1 > 0$, je parabola odprta navzgor. Pod osjo $x$ je med ničlama.
4. Neenačaj je oster, zato ničel ne vključimo.
5. Preizkus s številom iz intervala, na primer $x = 0$: $0 - 0 - 6 = -6 < 0$. Velja. Za $x = 4$: $16 - 4 - 6 = 6$, kar ni manjše od $0$, in $4$ res ni v rešitvi.
6. Odgovor: rešitev neenačbe je interval $(-2, 3)$.

### Primer 2 (srednji)

Reši neenačbo $-2x^2 + 5x + 3 \ge 0$. Koliko celih števil zadošča neenačbi?

**Podatki:** neenačba $-2x^2 + 5x + 3 \ge 0$; koeficienti $a = -2$, $b = 5$, $c = 3$
**Iščemo:** rešitev neenačbe in število celih rešitev

:::formula
$D = b^2 - 4ac$, $\; x_{1,2} = \dfrac{-b \pm \sqrt{D}}{2a}$; pri $a < 0$ je $f(x) \ge 0$ med ničlama, vključno z ničlama.
:::

**Rešitev:**

1. Diskriminanta: $D = 5^2 - 4 \cdot (-2) \cdot 3 = 25 + 24 = 49$.
2. Ničli: $x_{1,2} = \dfrac{-5 \pm 7}{2 \cdot (-2)} = \dfrac{-5 \pm 7}{-4}$. Torej $x_1 = \dfrac{2}{-4} = -\dfrac{1}{2}$ in $x_2 = \dfrac{-12}{-4} = 3$.
3. Ker je $a = -2 < 0$, je parabola odprta navzdol. Nad osjo $x$ je med ničlama.
4. Neenačaj je neoster, zato ničli spadata v rešitev: $x \in \left[-\dfrac{1}{2}, 3\right]$.
5. Cela števila v tem intervalu so $0$, $1$, $2$ in $3$ (število $-1$ je manjše od $-\dfrac{1}{2}$).
6. Preizkus: za $x = 3$ je $-18 + 15 + 3 = 0 \ge 0$, za $x = -1$ pa $-2 - 5 + 3 = -4 < 0$, zato $-1$ res ni rešitev.
7. Odgovor: rešitev je interval $\left[-\dfrac{1}{2}, 3\right]$, v njem so štiri cela števila: $0$, $1$, $2$ in $3$.

### Primer 3 (težji): poraba na avtocesti

Pred dolgo potjo te zanima, s kakšno hitrostjo se splača voziti. Poraba goriva avtomobila pri stalni hitrosti $v$ (v $\text{km/h}$) je približno $p(v) = 0{,}001v^2 - 0{,}16v + 11$ litrov na $100\,\text{km}$ (model velja za $30 \le v \le 130$). Pri katerih hitrostih avto porabi manj kot $5{,}5\,\text{L}$ na $100\,\text{km}$? Ali lahko porabi manj kot $4{,}5\,\text{L}$?

**Podatki:** $p(v) = 0{,}001v^2 - 0{,}16v + 11$ ($p$ v $\text{L}/100\,\text{km}$, $v$ v $\text{km/h}$), model za $30 \le v \le 130$, meji $5{,}5\,\text{L}/100\,\text{km}$ in $4{,}5\,\text{L}/100\,\text{km}$
**Iščemo:** hitrosti, pri katerih je $p(v) < 5{,}5$, in ali ima $p(v) < 4{,}5$ kakšno rešitev

:::formula
Neenačbo preoblikuj v $av^2 + bv + c < 0$; množenje s pozitivnim številom neenačaja ne obrne. $D = b^2 - 4ac$
:::

**Rešitev:**

1. Prva neenačba: $0{,}001v^2 - 0{,}16v + 11 < 5{,}5$. Vse prenesemo na levo: $0{,}001v^2 - 0{,}16v + 5{,}5 < 0$.
2. Pomnožimo s $1000$, da se znebimo decimalk; število je pozitivno, zato neenačaj ostane: $v^2 - 160v + 5500 < 0$.
3. Diskriminanta: $D = 160^2 - 4 \cdot 5500 = 25600 - 22000 = 3600$, ničli $v_{1,2} = \dfrac{160 \pm 60}{2}$, torej $v_1 = 50$ in $v_2 = 110$.
4. Parabola $v^2 - 160v + 5500$ je odprta navzgor, pod osjo je med ničlama: $v \in (50, 110)$. Interval leži v območju modela.
5. Preizkus za $v = 80$: $p(80) = 6{,}4 - 12{,}8 + 11 = 4{,}6 < 5{,}5$. Velja.
6. Druga neenačba: $0{,}001v^2 - 0{,}16v + 11 < 4{,}5$ da po enakih korakih $v^2 - 160v + 6500 < 0$. Zdaj ti: izračunaj diskriminanto in odloči.

:::premisli
Ima neenačba $v^2 - 160v + 6500 < 0$ rešitev?
---
Nima. $D = 25600 - 26000 = -400 < 0$, parabola je odprta navzgor in je vsa nad osjo. Odgovor: avto porabi manj kot $5{,}5\,\text{L}/100\,\text{km}$ pri hitrostih med $50$ in $110\,\text{km/h}$, pod $4{,}5\,\text{L}$ pa ne pride nikoli. Najmanjša poraba je $4{,}6\,\text{L}/100\,\text{km}$ pri $80\,\text{km/h}$ (teme parabole).
:::

## Pogoste napake

- **Deljenje z negativnim številom brez obrata neenačaja.** Iz $-x^2 + 9 > 0$ ne dobiš $x^2 - 9 > 0$. Pri množenju ali deljenju z negativnim številom se neenačaj obrne: $x^2 - 9 < 0$, rešitev je $(-3, 3)$. Če nisi prepričan, nariši parabolo kar za prvotno funkcijo, odprto navzdol.
- **»Korenjenje« neenačbe.** Iz $x^2 > 9$ ni res, da je $x > 3$. Pozabil si na negativna števila: tudi $(-4)^2 = 16 > 9$. Pravilno: $x^2 - 9 > 0$, ničli $-3$ in $3$, rešitev $(-\infty, -3) \cup (3, \infty)$.
- **Deljenje z $x$.** Iz $x^2 > 2x$ ne smeš dobiti $x > 2$, saj ne veš, ali je $x$ pozitiven, in izgubiš rešitve. Pravilno: $x^2 - 2x > 0$, ničli $0$ in $2$, rešitev $(-\infty, 0) \cup (2, \infty)$. Na primer $x = -1$: $1 > -2$ velja.
- **Napačno izbrano področje.** Učenci pogosto vedno zapišejo interval med ničlama. Ali je rešitev med ničlama ali zunaj njiju, je odvisno od predznaka $a$ in od neenačaja. Nariši skico in preveri z enim številom.
- **»$D < 0$ pomeni, da ni rešitve.«** Pri kvadratni enačbi to drži (v realnih številih), pri neenačbi pa ne. Neenačba $x^2 + x + 1 > 0$ ima $D = -3$, a velja za **vse** realne $x$, ker je parabola ves čas nad osjo.

## Povzetek

- Kvadratna neenačba: $ax^2 + bx + c > 0$ (ali $\ge$, $<$, $\le$), $a \ne 0$; rešitev je množica števil, zapisana z intervali.
- Najprej vse prenesi na levo, da je na desni $0$.
- Ničle poišči z $D = b^2 - 4ac$ in $x_{1,2} = \dfrac{-b \pm \sqrt{D}}{2a}$; nariši skico parabole.
- $f(x) > 0$: graf nad osjo $x$; $f(x) < 0$: graf pod osjo $x$.
- Za $a > 0$, $D > 0$: $f(x) < 0$ za $x \in (x_1, x_2)$, $f(x) > 0$ za $x \in (-\infty, x_1) \cup (x_2, \infty)$.
- Oster neenačaj: ničle izključimo $( \;)$; neoster: vključimo $[\;]$.
- Pri $D < 0$ ima $ax^2 + bx + c$ za vse $x$ predznak koeficienta $a$.
- Pri množenju ali deljenju z negativnim številom obrni neenačaj.

## Drugače: Z analogijo

Predstavljaj si, da je os $x$ gladina vode, parabola pa gorska veriga ali dolina. Vprašanje $f(x) > 0$ pomeni: kje je pokrajina **nad gladino**? Vprašanje $f(x) < 0$ pa: kje je **pod vodo**?

Parabola, odprta navzgor, je kot dolina. Če seže pod gladino, nastane jezero, ki se razteza od ene ničle do druge. Pod vodo je torej le odsek med ničlama, vse levo in desno je suho. Če dolino dvigneš tako, da se dno ravno dotakne gladine ($D = 0$), ni pod vodo nič; na gladini je le ena točka, dno. Če jo dvigneš še više ($D < 0$), je vsa pokrajina nad vodo.

Parabola, odprta navzdol, je kot hrib. Nad gladino štrli le vrh, med ničlama, pobočja levo in desno pa izginejo pod vodo.

## Drugače: Korak za korakom s številkami

Reši $x^2 + 2x > 8$ in rešitev preveri s preizkusom.

1. **Na desni naj bo nič:** $x^2 + 2x - 8 > 0$.
2. **Koeficienti:** $a = 1$, $b = 2$, $c = -8$.
3. **Diskriminanta:** $D = 2^2 - 4 \cdot 1 \cdot (-8) = 4 + 32 = 36$.
4. **Ničli:** $x_{1,2} = \dfrac{-2 \pm 6}{2}$, torej $x_1 = -4$ in $x_2 = 2$.
5. **Skica:** $a > 0$, parabola odprta navzgor, nad osjo je levo od $-4$ in desno od $2$.
6. **Oklepaji:** neenačaj je oster, ničli izključimo.
7. **Rešitev:** $(-\infty, -4) \cup (2, \infty)$.

**Preizkus s po enim številom iz vsakega dela:**

| $x$ | $x^2 + 2x$ | Ali je $> 8$? |
|---|---|---|
| $-5$ | $25 - 10 = 15$ | da |
| $0$ | $0$ | ne |
| $3$ | $9 + 6 = 15$ | da |

Ničle razdelijo os $x$ na dele, v katerih ima izraz povsod enak predznak, zato je dovolj preveriti po eno število iz vsakega dela.

## Drugače: Bolj natančno

Zakaj je predznak kvadratnega izraza na celem intervalu med ničlama enak? Če ima $f(x) = ax^2 + bx + c$ realni ničli $x_1 < x_2$, ga lahko razcepimo:

$$ax^2 + bx + c = a(x - x_1)(x - x_2).$$

Predznak produkta je odvisen od predznakov treh faktorjev. Faktor $x - x_1$ je negativen za $x < x_1$ in pozitiven za $x > x_1$, podobno $x - x_2$. Za $x < x_1$ sta oba faktorja negativna, njun produkt je pozitiven; za $x_1 < x < x_2$ je produkt negativen; za $x > x_2$ je spet pozitiven. Pomnožimo z $a$: pri $a > 0$ dobimo predznake $+, -, +$, pri $a < 0$ pa $-, +, -$. To je natanko slika parabole. Tak razmislek imenujemo tudi tabela predznakov.

Če je $D < 0$, uporabimo temensko obliko:

$$ax^2 + bx + c = a\left[\left(x + \frac{b}{2a}\right)^2 - \frac{D}{4a^2}\right].$$

Izraz v oglatem oklepaju je vsota nenegativnega kvadrata in pozitivnega števila $-\dfrac{D}{4a^2}$, zato je vedno pozitiven. Predznak celotnega izraza je zato vedno enak predznaku $a$.

## Preveri se

? Višina ceste nad snežno mejo je $f(x)$, kjer je $x$ oddaljenost od vrha prelaza v km. Kaj je rešitev neenačbe $f(x) > 0$?
- ničli funkcije $f$
~ Ničli sta rešitvi enačbe $f(x) = 0$: tam je cesta natanko na snežni meji. Neenačba sprašuje po vseh točkah nad njo.
+ množica vseh $x$, kjer je graf $f$ nad osjo $x$
- teme parabole
~ Teme je le najvišja točka ceste. Nad mejo je cel odsek okoli njega, ne ena točka.
- vrednost $f(x)$ na vrhu prelaza
~ Rešitev neenačbe so vrednosti $x$ (mesta na cesti), ne višine $f(x)$.
> Neenačba $f(x) > 0$ sprašuje, za katere $x$ je graf nad osjo $x$; rešitev je množica takih $x$, zapisana z intervali.

? V kakšnem vrstnem redu pravilno rešiš $3x^2 > 2x + 1$?
- deliš z $x$, nato rešiš linearno neenačbo
~ Z $x$ ne smeš deliti: ne veš, ali je pozitiven, in izgubiš rešitve (na primer $x = -1$).
- izračunaš ničli, nato zapišeš interval med njima
~ Interval med ničlama ni vedno rešitev. Odvisno je od predznaka $a$ in neenačaja, zato potrebuješ skico.
+ preneseš vse na levo, izračunaš ničli, skiciraš parabolo, zapišeš intervale
- koreniš obe strani, nato preneseš vse na levo
~ Korenjenje neenačbe ni dovoljeno; pri tem izgubiš negativne rešitve, kot sošolec pri prelazu.
> Najprej $3x^2 - 2x - 1 > 0$, ničli $-\dfrac{1}{3}$ in $1$, parabola je odprta navzgor, rešitev $\left(-\infty, -\dfrac{1}{3}\right) \cup (1, \infty)$.

? Rešitev neenačbe $x^2 - 4x + 3 < 0$ je $(1, 3)$. Kaj se zgodi z rešitvijo, če parabolo premaknemo za $2$ navzgor, torej rešujemo $x^2 - 4x + 5 < 0$?
- ostane $(1, 3)$
~ Premik spremeni ničle, zato se spremeni tudi rešitev.
- interval se razširi
~ Ko parabolo, odprto navzgor, dvigneš, je pod osjo manj grafa, ne več.
+ rešitve ni
- rešitev so vsa realna števila
~ Pri $D < 0$ ima izraz povsod predznak $a$, torej je povsod pozitiven. Vsa realna števila rešijo $x^2 - 4x + 5 > 0$, ne $< 0$.
> Teme je bilo v $(2, -1)$, po premiku je v $(2, 1)$. $D = 16 - 20 = -4 < 0$, parabola je vsa nad osjo, zato $x^2 - 4x + 5 < 0$ nima rešitve.

? Rešitev neenačbe $x^2 - 9 < 0$ je:
- $(-\infty, 3)$
~ To dobiš s »korenjenjem« v $x < 3$. Pozabil si na negativna števila: $(-5)^2 = 25$ ni manjše od $9$.
+ $(-3, 3)$
- $(-\infty, -3) \cup (3, \infty)$
~ To je rešitev $x^2 - 9 > 0$. Pri $a > 0$ je graf pod osjo med ničlama, ne zunaj njiju.
- $(3, \infty)$
~ Tu je graf nad osjo, na primer $4^2 - 9 = 7 > 0$.
> Ničli sta $-3$ in $3$. Parabola je odprta navzgor, pod osjo je med ničlama, torej $(-3, 3)$.

? Rešitev neenačbe $-x^2 + 6x - 8 \ge 0$ je:
- $(-\infty, 2] \cup [4, \infty)$
~ Tako bi bilo pri $a > 0$. Tu je $a = -1 < 0$, parabola je odprta navzdol in nad osjo med ničlama. Enako napako narediš, če pomnožiš z $-1$ in ne obrneš neenačaja.
+ $[2, 4]$
- $(2, 4)$
~ Neenačaj $\ge$ je neoster, zato ničli spadata v rešitev: $f(2) = 0 \ge 0$.
> Ničli sta $2$ in $4$. Parabola je odprta navzdol, nad osjo je med ničlama; neenačaj je neoster, zato ničli vključimo.

:::simboli
a | vodilni koeficient (pri $x^2$) | | | $a \ne 0$
b | linearni koeficient (pri $x$) | | |
c | prosti člen | | |
x | neznanka | | |
f | kvadratna funkcija | f(x) = ax^2 + bx + c | |
D | diskriminanta | D = b^2 - 4ac | |
x_{1,2} | ničli kvadratne funkcije | x_{1,2} = \frac{-b \pm \sqrt{D}}{2a} | |
x_1, x_2 | manjša in večja ničla | | | $x_1 < x_2$
v | hitrost avtomobila (neznanka v Primeru 3) | | km/h | poraba $p(v)$ v L na 100 km
:::
