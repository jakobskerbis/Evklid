---
stanje: osnutek
demo: urejanje
avtor: AI
---

## Zakaj se tega učimo

V prvi polovici 19. stoletja je Augustin-Louis Cauchy pisal učbenik analize za študente pariške politehnike. Hotel je vse dokazati strogo, zato je potreboval oceno za vsoto produktov $a_1 b_1 + a_2 b_2 + \dots + a_n b_n$. Našel jo je: vsoto produktov omeji z vsotama kvadratov. Pozneje sta isto misel za integrale razvila Viktor Bunjakovski in Hermann Amandus Schwarz, zato danes govorimo o Cauchy-Schwarzevi neenakosti. Ruski matematik Pafnutij Čebišev je dokazal sorodno oceno za povprečja produktov. V 20. stoletju so G. H. Hardy, J. E. Littlewood in George Pólya tovrstne ocene zbrali v knjigi *Inequalities*, kjer ima svoje mesto tudi neenakost urejanja.

Vse tri neenakosti izhajajo iz vprašanja, ki si ga postavi vsak igralec namizne igre. Imaš žetone z $2$, $5$ in $8$ točkami ter tri polja, ki točke pomnožijo z $1$, $2$ in $3$. Kam postaviš kateri žeton? Občutek pravi: največji žeton na največji množitelj. Ta občutek je pravilen, njegov dokaz pa je ključ do številnih tekmovalnih nalog o neenakostih.

## Razlaga

**1. Produkt je pravokotnik.** Žeton z vrednostjo $a$ na polju z množiteljem $b$ prinese $a \cdot b$ točk. To je ploščina pravokotnika s širino $a$ in višino $b$. Skupno število točk je skupna ploščina treh pravokotnikov.

:::risba skica
opis: Dve vrsti po tri pravokotnike s širinami 2, 5 in 8. V zgornji vrsti so višine 1, 2 in 3, skupna ploščina je 36. V spodnji vrsti so višine 3, 2 in 1, skupna ploščina je 24.
območje: 0; 0 .. 17; 10
enota: 18
pravokotnik: 0; 5,5 .. 2; 6,5 | modra
pravokotnik: 2,5; 5,5 .. 7,5; 7,5 | modra
pravokotnik: 8; 5,5 .. 16; 8,5 | modra
napis: 1; 6 | 2·1 | sredina
napis: 5; 6,5 | 5·2 | sredina
napis: 12; 7 | 8·3 | sredina
napis: 0; 9,5 | enako urejeno: 36 | desno
pravokotnik: 0; 0,5 .. 2; 3,5 | oranžna
pravokotnik: 2,5; 0,5 .. 7,5; 2,5 | oranžna
pravokotnik: 8; 0,5 .. 16; 1,5 | oranžna
napis: 1; 2 | 2·3 | sredina
napis: 5; 1,5 | 5·2 | sredina
napis: 12; 1 | 8·1 | sredina
napis: 8; 4 | nasprotno urejeno: 24 | desno
podnapis: Zgoraj širok pravokotnik dobi največjo višino, spodaj najmanjšo.
:::

V zgornji vrsti najširši pravokotnik dobi največjo višino in skupna ploščina je največja. V spodnji vrsti je ravno obratno. Vseh šest razporeditev pokaže tabela:

| žeton $2$ | žeton $5$ | žeton $8$ | točke |
|---|---|---|---|
| $\times 1$ | $\times 2$ | $\times 3$ | $36$ |
| $\times 1$ | $\times 3$ | $\times 2$ | $33$ |
| $\times 2$ | $\times 1$ | $\times 3$ | $33$ |
| $\times 2$ | $\times 3$ | $\times 1$ | $27$ |
| $\times 3$ | $\times 1$ | $\times 2$ | $27$ |
| $\times 3$ | $\times 2$ | $\times 1$ | $24$ |

**2. Zamenjava dveh višin.** Zakaj je zgornja razporeditev najboljša? Vzemi dva pravokotnika, širini $a_i < a_j$, in dve višini $b_i < b_j$. Če ožji dobi nižjo višino, širši pa višjo, je ploščina večja kot navzkriž. Razlika je natanko ploščina enega majhnega pravokotnika:

$$(a_j b_j + a_i b_i) - (a_i b_j + a_j b_i) = (a_j - a_i)(b_j - b_i)$$

Oba oklepaja sta pozitivna, zato je razlika pozitivna. Vsaka zamenjava, ki popravi »napačen« par, vsoto poveča.

:::premisli
V razporeditvi s $36$ točkami zamenjaš le množitelja žetonov $5$ in $8$. Koliko točk izgubiš? Napovej s pravokotnikom razlike, nato preveri v tabeli.
---
Izgubiš $(8 - 5)(3 - 2) = 3$ točke, ostane $33$. Tabela to potrdi v drugi vrstici.
:::

**3. Neenakost urejanja.** Zaporedji sta **enako urejeni**, če večjemu členu prvega pripada večji člen drugega, in **nasprotno urejeni**, če mu pripada manjši. Naj bo $a_1 \le a_2 \le \dots \le a_n$ in $b_1 \le b_2 \le \dots \le b_n$, števila $c_1, \dots, c_n$ pa ista števila $b_i$ v poljubnem vrstnem redu. Ker lahko vsak napačen par popravimo z zamenjavo, velja:

$$a_1 c_1 + \dots + a_n c_n \le a_1 b_1 + \dots + a_n b_n$$

$$a_1 c_1 + \dots + a_n c_n \ge a_1 b_n + \dots + a_n b_1$$

Enako urejeni zaporedji dasta največjo vsoto, nasprotno urejeni najmanjšo. Števila so lahko tudi negativna; pomembno je le, da obe zaporedji najprej urediš.

Hiter primer uporabe: zaporedje $(a, b, c)$ je samo s sabo vedno enako urejeno, ne glede na to, katero število je največje. Trojica $(b, c, a)$ je druga razporeditev istih števil. Zato je $a \cdot a + b \cdot b + c \cdot c \ge a \cdot b + b \cdot c + c \cdot a$, torej $a^2 + b^2 + c^2 \ge ab + bc + ca$ za vsa realna števila.

**4. Čebišev: vse razporeditve hkrati.** Vzemi $a = (1, 2, 3)$ in $b = (4, 5, 6)$ ter člene $b$ ciklično zamikaj:

| razporeditev $b$ | vsota produktov |
|---|---|
| $4, 5, 6$ | $1 \cdot 4 + 2 \cdot 5 + 3 \cdot 6 = 32$ |
| $5, 6, 4$ | $1 \cdot 5 + 2 \cdot 6 + 3 \cdot 4 = 29$ |
| $6, 4, 5$ | $1 \cdot 6 + 2 \cdot 4 + 3 \cdot 5 = 29$ |

Vsota vseh treh vrstic je $90 = (1 + 2 + 3)(4 + 5 + 6)$: vsak $a_i$ se v treh vrsticah pomnoži z vsakim $b_j$ natanko enkrat. Vsaka vrstica je največ $32$, zato je $90 \le 3 \cdot 32 = 96$. Isti premislek za $n$ enako urejenih členov da **Čebiševo neenakost**:

$$(a_1 + \dots + a_n)(b_1 + \dots + b_n) \le n(a_1 b_1 + \dots + a_n b_n)$$

Z besedami: povprečje produktov je vsaj produkt povprečij.

:::premisli
Kaj velja, če sta zaporedji nasprotno urejeni? Zakaj se neenakost takrat obrne?
---
Takrat je dana razporeditev najmanjša med vsemi, zato je vsaka vrstica ciklične tabele vsaj tolikšna kot ona. Dobimo $n(a_1 b_1 + \dots + a_n b_n) \le (a_1 + \dots + a_n)(b_1 + \dots + b_n)$.
:::

**5. Cauchy-Schwarz: dolžine namesto vrstnega reda.** Pri $n = 2$ si $(a_1, a_2)$ in $(b_1, b_2)$ predstavljaj kot puščici v ravnini. Vsota $a_1 b_1 + a_2 b_2$ je skalarni produkt in nikoli ne preseže produkta dolžin. Dolžina puščice $(a_1, a_2)$ je $\sqrt{a_1^2 + a_2^2}$, zato po kvadriranju trdimo $(a_1 b_1 + a_2 b_2)^2 \le (a_1^2 + a_2^2)(b_1^2 + b_2^2)$. Algebrsko to pove Lagrangeva identiteta:

$$(a_1^2 + a_2^2)(b_1^2 + b_2^2) - (a_1 b_1 + a_2 b_2)^2 = (a_1 b_2 - a_2 b_1)^2$$

Desna stran je kvadrat, torej ni negativna. Za poljuben $n$ velja **Cauchy-Schwarzeva neenakost**:

$$(a_1 b_1 + \dots + a_n b_n)^2 \le (a_1^2 + \dots + a_n^2)(b_1^2 + \dots + b_n^2)$$

Dokaz: funkcija $f(x) = (a_1 x - b_1)^2 + \dots + (a_n x - b_n)^2$ ni nikoli negativna. Ko kvadrate razpišeš, je to kvadratna funkcija $Ax^2 + Bx + C$ z $A = a_1^2 + \dots + a_n^2$, $B = -2(a_1 b_1 + \dots + a_n b_n)$ in $C = b_1^2 + \dots + b_n^2$. Funkcija brez negativnih vrednosti nima dveh različnih ničel, zato $B^2 - 4AC \le 0$; po deljenju s $4$ je to natanko zgornja neenakost. Enakost velja, ko sta zaporedji **sorazmerni**: $b_i = t a_i$ za neko število $t$.

**6. Engelova oblika.** Če v Cauchy-Schwarzu vzameš $a_i = \frac{x_i}{\sqrt{y_i}}$ in $b_i = \sqrt{y_i}$, pri pozitivnih $y_i$ je $a_i b_i = x_i$, $a_i^2 = \frac{x_i^2}{y_i}$ in $b_i^2 = y_i$. Dobiš obliko, ki jo na tekmovanjih uporabljamo najpogosteje:

$$\frac{x_1^2}{y_1} + \dots + \frac{x_n^2}{y_n} \ge \frac{(x_1 + \dots + x_n)^2}{y_1 + \dots + y_n}$$

Enakost velja, ko so količniki $\frac{x_i}{y_i}$ vsi enaki.

Preizkusi sam v simulaciji spodaj »Neenakost urejanja in Cauchy-Schwarz«: pravokotniki imajo širine $1$, $2$, $4$ in $7$, višine pa zamenjaš s klikom na dve ploščici. Uredi višine tako, da bo vsota največja, nato še najmanjša. Opazi: največja vsota je $70$, najmanjša $42$, kvadrat vsote produktov pa nikoli ne preseže $5180$.

## Rešeni primeri

### Primer 1 (lažji): žeton z minusom

Na igralni plošči so štiri polja z množitelji $1$, $2$, $3$ in $4$. Igralka ima žetone s $3$, $-2$, $5$ in $1$ točko. Na vsako polje postavi en žeton. Koliko točk lahko dobi največ in koliko najmanj?

**Podatki:** množitelji $1, 2, 3, 4$; žetoni $3, -2, 5, 1$
**Iščemo:** največjo in najmanjšo vsoto produktov

:::formula
Neenakost urejanja: enako urejeni zaporedji dasta največjo, nasprotno urejeni najmanjšo vsoto.
:::

**Rešitev:**

1. Žetone uredimo: $-2 < 1 < 3 < 5$. Brez urejanja ne vemo, kateri par je »pravi«.
2. Največ: enako urejeno, $-2 \cdot 1 + 1 \cdot 2 + 3 \cdot 3 + 5 \cdot 4 = 29$.
3. Najmanj: nasprotno urejeno, $(-2) \cdot 4 + 1 \cdot 3 + 3 \cdot 2 + 5 \cdot 1 = 6$.
4. Odgovor: igralka dobi največ $29$ in najmanj $6$ točk. Negativni žeton gre pri največji vsoti na najmanjši množitelj, ker tam najmanj škodi.

### Primer 2: najmanjša vsota kvadratov

Realna števila $x$, $y$, $z$ izpolnjujejo $x + 2y + 2z = 9$. Kolikšna je najmanjša možna vrednost $x^2 + y^2 + z^2$ in kdaj jo dosežemo?

**Podatki:** $x + 2y + 2z = 9$; $x, y, z$ realni
**Iščemo:** najmanjšo vrednost $x^2 + y^2 + z^2$ in pripadajoče $x, y, z$

:::formula
$(a_1 b_1 + a_2 b_2 + a_3 b_3)^2 \le (a_1^2 + a_2^2 + a_3^2)(b_1^2 + b_2^2 + b_3^2)$, enakost pri $b_i = t a_i$
:::

**Rešitev:**

1. Izberemo $(a_1, a_2, a_3) = (1, 2, 2)$ in $(b_1, b_2, b_3) = (x, y, z)$, da je leva vsota natanko dani pogoj.
2. Cauchy-Schwarz: $9^2 \le (1 + 4 + 4)(x^2 + y^2 + z^2)$, torej $81 \le 9(x^2 + y^2 + z^2)$.
3. Delimo z $9$: $x^2 + y^2 + z^2 \ge 9$.
4. Enakost: $(x, y, z) = t(1, 2, 2)$. Vstavimo v pogoj: $t + 4t + 4t = 9$, torej $t = 1$.
5. Preizkus: pogoj $1 + 2 \cdot 2 + 2 \cdot 2 = 9$ drži, vsota kvadratov pa je $1^2 + 2^2 + 2^2 = 9$.
6. Odgovor: najmanjša vrednost je $9$, dosežemo jo pri $x = 1$, $y = 2$, $z = 2$.

### Primer 3 (težji): razporeditev treninga

Triatlonka ima na teden $12$ ur treninga. Razdeli jih na tek ($h_1$ ur), kolesarjenje ($h_2$ ur) in plavanje ($h_3$ ur). Njen trener uporablja preprost model utrujenosti $U = h_1^2 + \frac{h_2^2}{2} + \frac{h_3^2}{3}$: vsaka dodatna ura utrudi bolj kot prejšnja, plavanje pa najmanj obremeni sklepe. Kako naj razdeli ure, da bo utrujenost najmanjša, in kolikšna je takrat?

**Podatki:** $h_1 + h_2 + h_3 = 12\,\mathrm{h}$; $U = h_1^2 + \frac{h_2^2}{2} + \frac{h_3^2}{3}$; $h_1, h_2, h_3 > 0$
**Iščemo:** najmanjšo utrujenost $U$ in ure $h_1, h_2, h_3$

:::formula
Engelova oblika: $\dfrac{x_1^2}{y_1} + \dfrac{x_2^2}{y_2} + \dfrac{x_3^2}{y_3} \ge \dfrac{(x_1 + x_2 + x_3)^2}{y_1 + y_2 + y_3}$, enakost pri enakih $\dfrac{x_i}{y_i}$
:::

**Rešitev:**

1. Prvi člen zapišemo kot ulomek: $h_1^2 = \frac{h_1^2}{1}$. Zdaj so $x_i = h_i$ in $y_i = 1, 2, 3$.
2. Engel: $U \ge \frac{(h_1 + h_2 + h_3)^2}{1 + 2 + 3} = \frac{144}{6} = 24$.
3. Enakost: $\frac{h_1}{1} = \frac{h_2}{2} = \frac{h_3}{3} = k$, torej $h_1 = k$, $h_2 = 2k$, $h_3 = 3k$.
4. Iz $k + 2k + 3k = 12$ sledi $k = 2$, torej $h_1 = 2$, $h_2 = 4$, $h_3 = 6$.
5. Preizkus: $2^2 + \frac{4^2}{2} + \frac{6^2}{3} = 4 + 8 + 12 = 24$.
6. Odgovor: najmanjša utrujenost je $24$ pri $2\,\mathrm{h}$ teka, $4\,\mathrm{h}$ kolesarjenja in $6\,\mathrm{h}$ plavanja. Več ur dobi disciplina, ki manj utruja.

### Primer 4: zdaj ti

Pozitivna števila $a$, $b$, $c$ imajo vsoto $3$. Dokaži, da je $a^3 + b^3 + c^3 \ge a^2 + b^2 + c^2$.

**Podatki:** $a, b, c > 0$; $a + b + c = 3$
**Iščemo:** dokaz neenakosti $a^3 + b^3 + c^3 \ge a^2 + b^2 + c^2$

:::formula
Čebišev za $n = 3$: $(a_1 + a_2 + a_3)(b_1 + b_2 + b_3) \le 3(a_1 b_1 + a_2 b_2 + a_3 b_3)$ za enako urejeni zaporedji
:::

**Rešitev:**

1. Zapišemo $a^3 = a \cdot a^2$. Zaporedji $(a, b, c)$ in $(a^2, b^2, c^2)$ sta enako urejeni, ker je kvadriranje pri pozitivnih številih naraščajoče.
2. Čebišev: $(a + b + c)(a^2 + b^2 + c^2) \le 3(a^3 + b^3 + c^3)$.
3. Dokončaj sam: upoštevaj $a + b + c = 3$ in ugotovi, kdaj velja enakost.

:::premisli
Kako se dokaz konča?
---
Leva stran je $3(a^2 + b^2 + c^2)$, zato po deljenju s $3$ dobimo $a^2 + b^2 + c^2 \le a^3 + b^3 + c^3$. Enakost velja pri $a = b = c = 1$, ko so vsi členi enaki.
:::

## Pogoste napake

- **Vsota v danem vrstnem redu je največja.** Kdor zmnoži $a_1 b_1 + \dots$ kar po vrsti, kot so podana, dobi neko vsoto, ne največje. Neenakost urejanja govori o *urejenih* zaporedjih: najprej uredi oba, nato pari.
- **Pozabljen pogoj o urejenosti.** Čebišev in sklep »$a$ in $a^2$ sta enako urejena« zahtevata, da sta zaporedji res enako urejeni. Pri negativnih številih to ne drži: $a^3 + b^3 \ge a^2 b + a b^2$ pri $a = -1$, $b = 0$ ne velja. Preveri predznake.
- **Napačen pogoj za enakost.** Pri Cauchy-Schwarzu mnogi takoj vzamejo $x = y = z$. Enakost velja pri sorazmernih zaporedjih, $b_i = t a_i$; ena sama enakost $x = y$ je pravilna le, če so enaki tudi pripadajoči $a_i$. Brez preizkusa meja morda sploh ni dosežena.
- **Manjkajoč kvadrat.** Neenakost $a_1 b_1 + \dots + a_n b_n \le (a_1^2 + \dots)(b_1^2 + \dots)$ brez kvadrata na levi ni Cauchy-Schwarz in je pri majhnih številih napačna. Na levi je kvadrat vsote, na desni produkt vsot kvadratov.
- **Engel z negativnim imenovalcem.** Engelova oblika velja le pri pozitivnih $y_i$. Pri negativnem imenovalcu sklep odpove: za $x_1 = x_2 = 1$, $y_1 = 2$, $y_2 = -1$ je leva stran $-\frac{1}{2}$, desna pa $4$.

## Povzetek

- Neenakost urejanja: enako urejeni zaporedji dasta največjo vsoto produktov, nasprotno urejeni najmanjšo. Dokaz: zamenjava para spremeni vsoto za $(a_j - a_i)(b_j - b_i)$.
- Čebišev: za enako urejeni zaporedji je $(a_1 + \dots + a_n)(b_1 + \dots + b_n) \le n(a_1 b_1 + \dots + a_n b_n)$; za nasprotno urejeni se obrne.
- Cauchy-Schwarz: $(a_1 b_1 + \dots + a_n b_n)^2 \le (a_1^2 + \dots + a_n^2)(b_1^2 + \dots + b_n^2)$, enakost pri sorazmernih zaporedjih.
- Engelova oblika: $\sum \frac{x_i^2}{y_i} \ge \frac{(\sum x_i)^2}{\sum y_i}$ za pozitivne $y_i$.
- Pri iskanju najmanjše ali največje vrednosti vedno poišči tudi primer enakosti in ga preizkusi.

## Drugače: Z analogijo

Cauchy-Schwarz je kot senca palice. Palico dolžine $|a| = \sqrt{a_1^2 + \dots + a_n^2}$ osvetliš s soncem; njena senca na tleh v smeri $b$ je dolga največ toliko kot palica. Skalarni produkt $a_1 b_1 + \dots + a_n b_n$ je dolžina sence, pomnožena z dolžino $|b|$, zato ne preseže $|a| \cdot |b|$. Senca je enako dolga kot palica le, ko palica leži v smeri $b$; to je pogoj sorazmernosti.

Neenakost urejanja je kot sestavljanje parov v plesni šoli po višini. Če najvišjega plesalca postaviš k najvišji plesalki in tako naprej, je vsota »ujemanj« največja. Vsak par, ki je navzkriž, lahko zamenjaš in s tem le pridobiš.

## Drugače: Iz vsakdanjega življenja

V trgovini imaš tri kupone za $10\,\%$; $20\,\%$ in $30\,\%$ popusta, v košarici pa izdelke po $15$, $40$ in $80$ evrov. Na vsak izdelek gre en kupon. Največji kupon daš najdražjemu izdelku: prihranek je $0{,}3 \cdot 80 + 0{,}2 \cdot 40 + 0{,}1 \cdot 15 = 33{,}5$ evra. Če bi kupone razdelil obratno, bi prihranil le $0{,}1 \cdot 80 + 0{,}2 \cdot 40 + 0{,}3 \cdot 15 = 20{,}5$ evra. To je neenakost urejanja na blagajni.

Čebišev se skriva v treningu: če več ur treniraš na dneve, ko si bolj spočit, je povprečni učinek boljši, kot če bi ure razdelil enakomerno ali na slabe dneve.

## Preveri se

? Tri izmed teh neenakosti veljajo za **vsa** realna števila, ena ne. Katera izstopa?
- $(ac + bd)^2 \le (a^2 + b^2)(c^2 + d^2)$
~ To je Cauchy-Schwarz za $n = 2$ in velja za vsa realna števila, tudi negativna.
- $a^2 + b^2 + c^2 \ge ab + bc + ca$
~ To sledi iz neenakosti urejanja, ki velja za poljubna realna števila; zaporedje $(a, b, c)$ je samo s sabo vedno enako urejeno.
+ $a^3 + b^3 \ge a^2 b + a b^2$
- $(a + b + c)^2 \le 3(a^2 + b^2 + c^2)$
~ To je Cauchy-Schwarz z $(1, 1, 1)$ in $(a, b, c)$; velja za vsa realna števila.
> Pri $a = -1$, $b = 0$ je leva stran $-1$, desna $0$. Razlika obeh strani je $(a + b)(a - b)^2$, zato neenakost velja natanko pri $a + b \ge 0$. Za nenegativna števila jo da že neenakost urejanja, ker sta takrat $(a, b)$ in $(a^2, b^2)$ enako urejena.

? Realna števila izpolnjujejo $2x + 3y + 6z = 14$. Kolikšna je najmanjša možna vrednost $x^2 + y^2 + z^2$?
= 4 | 0,01
~ 196 | To je $14^2$. Deliti moraš še z $2^2 + 3^2 + 6^2 = 49$.
~ 2 | To je najmanjša razdalja $\sqrt{x^2 + y^2 + z^2}$, ne vsota kvadratov.
~ 0,29 | Pozabil si kvadrirati $14$: leva stran Cauchy-Schwarza je kvadrat vsote.
> $14^2 \le 49(x^2 + y^2 + z^2)$, torej $x^2 + y^2 + z^2 \ge 4$. Enakost pri $(x, y, z) = t(2, 3, 6)$ z $t = \frac{2}{7}$.

? Na risbi so pravokotniki s širinami $1$, $3$ in $5$ ter višinami $2$, $6$ in $4$. Kaj se zgodi s skupno ploščino, če zamenjaš višini drugega in tretjega pravokotnika, in zakaj?
:::risba skica
opis: Trije pravokotniki na skupni osnovnici. Prvi je širok 1 in visok 2, drugi širok 3 in visok 6, tretji širok 5 in visok 4.
območje: 0; 0 .. 11; 7
enota: 25
pravokotnik: 0,5; 0,5 .. 1,5; 2,5 | modra
pravokotnik: 2; 0,5 .. 5; 6,5 | modra
pravokotnik: 5,5; 0,5 .. 10,5; 4,5 | modra
napis: 1; 1,5 | 1·2 | sredina
napis: 3,5; 3,5 | 3·6 | sredina
napis: 8; 2,5 | 5·4 | sredina
:::
- Ostane enaka, ker se ploščina pri zamenjavi samo prerazporedi.
~ Ploščina ni stalna: odvisna je od tega, katera širina dobi katero višino. Preveri: $40$ pred zamenjavo, $44$ po njej.
+ Poveča se za $4$, ker zdaj širši pravokotnik dobi večjo višino.
- Zmanjša se za $4$, ker večja višina preide na desni del.
~ Premik v desno ni pomemben; pomembno je, da večja višina preide k večji širini, kar vsoto poveča.
> Pred zamenjavo je $1 \cdot 2 + 3 \cdot 6 + 5 \cdot 4 = 40$, po njej $1 \cdot 2 + 3 \cdot 4 + 5 \cdot 6 = 44$. Razlika je $(5 - 3)(6 - 4) = 4$.

? Iščemo najmanjšo vrednost $\frac{1}{x} + \frac{4}{y}$ za pozitivna $x$, $y$ z $x + y = 1$. Kateri korak rešitve je napačen?
1) $\frac{1}{x} + \frac{4}{y} = \frac{1^2}{x} + \frac{2^2}{y}$.
2) Engelova oblika: $\frac{1^2}{x} + \frac{2^2}{y} \ge \frac{(1 + 2)^2}{x + y} = 9$.
3) Enakost velja pri $x = y$, torej pri $x = y = \frac{1}{2}$.
4) Najmanjša vrednost je torej $9$.
- Korak 1)
~ Zapis je pravilen: $4 = 2^2$. Prav ta zapis omogoči uporabo Engelove oblike.
- Korak 2)
~ Engelova oblika je uporabljena pravilno: $x, y > 0$, števca $1$ in $2$, $(1 + 2)^2 = 9$.
+ Korak 3)
- Korak 4)
~ Meja $9$ je res najmanjša vrednost, ker je dosežena, le ne v točki iz koraka 3.
> Enakost velja pri $\frac{1}{x} = \frac{2}{y}$, torej $y = 2x$: $x = \frac{1}{3}$, $y = \frac{2}{3}$, kjer je vrednost $3 + 6 = 9$. Pri $x = y = \frac{1}{2}$ dobiš $2 + 8 = 10$.

? Razvrsti korake iskanja najmanjše vrednosti $x^2 + y^2 + z^2$ pri linearnem pogoju s Cauchy-Schwarzem.
1. Pogoj zapiši kot vsoto produktov $a_1 x + a_2 y + a_3 z$.
2. Uporabi Cauchy-Schwarzevo neenakost za $(a_1, a_2, a_3)$ in $(x, y, z)$.
3. Vstavi znano vsoto in izrazi spodnjo mejo.
4. Iz $(x, y, z) = t(a_1, a_2, a_3)$ in pogoja izračunaj $t$.
5. Preizkusi točko in zapiši najmanjšo vrednost.
> Najprej pripraviš obliko, nato oceniš, na koncu pokažeš, da je meja dosežena. Brez zadnjih dveh korakov meja morda ni najmanjša vrednost.

<<RACUN
vrednost: -2*1+1*2+3*3+5*4 | 29
vrednost: (-2)*4+1*3+3*2+5*1 | 6
vrednost: 2*1+5*2+8*3 | 36
vrednost: 2*3+5*2+8*1 | 24
enako: (a1^2+a2^2)*(b1^2+b2^2)-(a1*b1+a2*b2)^2 | (a1*b2-a2*b1)^2
enako: (aj*bj+ai*bi)-(ai*bj+aj*bi) | (aj-ai)*(bj-bi)
vrednost: 9^2/(1^2+2^2+2^2) | 9
resi: t+4*t+4*t=9 | t | 1
vrednost: 12^2/(1+2+3) | 24
resi: k+2*k+3*k=12 | k | 2
vrednost: 2^2+4^2/2+6^2/3 | 24
vrednost: 14^2/(2^2+3^2+6^2) | 4
vrednost: 1*2+3*4+5*6-(1*2+3*6+5*4) | 4
vrednost: 1/(1/3)+4/(2/3) | 9
vrednost: 1/(1/2)+4/(1/2) | 10
vrednost: 0.3*80+0.2*40+0.1*15 | 33.5
vrednost: 0.1*80+0.2*40+0.3*15 | 20.5
vrednost: 3*(1*4+2*5+3*6) | 96
vrednost: (1+2+3)*(4+5+6) | 90
vrednost: 2*1+5*3+8*2 | 33
vrednost: 2*2+5*1+8*3 | 33
vrednost: 2*2+5*3+8*1 | 27
vrednost: 2*3+5*1+8*2 | 27
vrednost: 1*2+2*3+4*5+7*6 | 70
vrednost: 1*6+2*5+4*3+7*2 | 42
vrednost: (1^2+2^2+4^2+7^2)*(2^2+3^2+5^2+6^2) | 5180
enako: a^3+b^3-a^2*b-a*b^2 | (a+b)*(a-b)^2
vrednost: 1^2/2+1^2/(-1) | -1/2
vrednost: (1+1)^2/(2-1) | 4
>>

:::simboli
a_i, a_j | člena prvega zaporedja (širini pravokotnikov) | |
b_i, b_j | člena drugega zaporedja (višini pravokotnikov) | |
a_1, a_2, a_3 | členi prvega zaporedja | |
b_1, b_2, b_3 | členi drugega zaporedja | |
a_n, b_n | zadnja člena zaporedij (v urejenih zaporedjih največja) | |
c_1, c_n | števila $b_i$ v poljubnem vrstnem redu | |
n | število členov zaporedja | |
x_i, x_1, x_2, x_3, x_n | števila, ki so v števcih Engelove oblike kvadrirana | |
y_i, y_1, y_2, y_3, y_n | pozitivni imenovalci v Engelovi obliki | | | $y_i > 0$
t | faktor sorazmernosti | b_i = t a_i | | pogoj za enakost
:::
