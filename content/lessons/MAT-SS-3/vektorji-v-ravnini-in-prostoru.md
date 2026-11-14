---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

**Tristo in tristo je tristo?** Dva atleta na treningu vlečeta težke sani, vsak s svojo vrvjo. Vsak vleče s silo $300\,\mathrm{N}$. Vrvi med seboj oklepata kot $120^\circ$. S kolikšno skupno silo vlečeta sani? Odgovor je $300\,\mathrm{N}$, toliko kot bi vlekel en sam atlet.

Zveni napačno, a ni. Sila nima le velikosti, ampak tudi smer. Ko vlečeta vsak malo vstran, se del njunega truda izniči. Količinam z velikostjo in smerjo pravimo **vektorji**: sila, hitrost, premik žoge po igrišču.

Z vektorji seštevaš premike pri podajah, hitrosti čolna in reke ali sile pri vlečenju. Brez njih bi fizika, računalniške igre in navigacija računale narobe. Spodaj jih boš seštel in množil s števili. Uganko s sanmi pa razvozlaš sredi razlage.

## Razlaga

**Najprej en primer.** Na nogometnem igrišču postavimo koordinatni sistem: os $x$ kaže proti nasprotnikovim vratom, os $y$ v levo, enota je meter. Žoga je na začetku v izhodišču $O$. Prva podaja jo premakne $12\,\mathrm{m}$ naprej in $5\,\mathrm{m}$ v levo. Druga podaja $3\,\mathrm{m}$ naprej in $4\,\mathrm{m}$ v levo. Kje je žoga na koncu?

Premike seštejemo po smereh: naprej $12 + 3 = 15$, v levo $5 + 4 = 9$. Žoga konča v točki $(15, 9)$. Isti cilj bi dosegla z eno samo podajo $15\,\mathrm{m}$ naprej in $9\,\mathrm{m}$ v levo.

Koliko pa so podaje dolge? Po Pitagorovem izreku je prva dolga $\sqrt{12^2 + 5^2} = 13\,\mathrm{m}$, druga $\sqrt{3^2 + 4^2} = 5\,\mathrm{m}$. Skupaj je žoga prepotovala $18\,\mathrm{m}$. Od izhodišča pa je oddaljena le $\sqrt{15^2 + 9^2} = \sqrt{306} \approx 17{,}5\,\mathrm{m}$. Spet ista uganka kot pri saneh: dolžini se ne seštejeta.

**Kaj je vektor.** Vsako podajo narišemo kot puščico, **usmerjeno daljico**. Vektor ima tri lastnosti: **dolžino** (velikost), **smer** (premico, na kateri leži) in **usmerjenost** (kam kaže puščica). Vektor označimo z $\vec a$, njegovo dolžino z $|\vec a|$.

Dve puščici z enako dolžino, smerjo in usmerjenostjo predstavljata **isti vektor**, tudi če začneta na različnih mestih. Podaja »$12\,\mathrm{m}$ naprej in $5\,\mathrm{m}$ levo« je isti vektor, ne glede na to, kje na igrišču jo izvedeš. Puščico lahko zato vzporedno premikamo.

**Seštevanje na sliki.** V primeru smo drugo puščico narisali tam, kjer se konča prva. Vsota $\vec a + \vec b$ je puščica od začetka prve do konca druge. To je **pravilo trikotnika**.

Lahko pa obe puščici narišeš iz iste točke in ju dopolniš v paralelogram. Vsota je diagonala iz skupnega začetka. To je **pravilo paralelograma**. Obe pravili dasta isti vektor, in iz paralelograma vidiš, da je $\vec a + \vec b = \vec b + \vec a$.

**Seštevanje s številkami.** Vektor v ravnini zapišemo s **komponentama**: $\vec a = (a_x, a_y)$. Prva pove premik vzdolž osi $x$, druga vzdolž osi $y$. V prostoru dodamo še višino: $\vec a = (a_x, a_y, a_z)$. Primer je žoga, ki pri lobu poleti tudi navzgor. Seštevamo po komponentah, kot pri podajah:

$$\vec a + \vec b = (a_x + b_x,\ a_y + b_y,\ a_z + b_z)$$

Dolžino dobiš s Pitagorovim izrekom, v prostoru z eno komponento več:

$$|\vec a| = \sqrt{a_x^2 + a_y^2 + a_z^2}$$

:::premisli
Vemo, da je $|\vec a + \vec b|$ navadno manj kot $|\vec a| + |\vec b|$. Kako morata biti postavljena vektorja, da sta ti dve števili enaki?
---
Imeti morata enako smer in usmerjenost. Takrat druga puščica nadaljuje prvo v isti premici in se dolžini res seštejeta. V vseh drugih primerih je pot »po ovinku« daljša od bližnjice.
:::

**Uganka s sanmi.** Sili $\vec F_1$ in $\vec F_2$ narišemo iz iste točke in ju dopolnimo v paralelogram. Stranici sta enako dolgi, zato je paralelogram **romb**. Kot med silama je $120^\circ$, sosednji kot romba pa $180^\circ - 120^\circ = 60^\circ$. Vsota sil je diagonala iz skupnega začetka. Ta razpolovi kot $120^\circ$ na dva kota po $60^\circ$ in razdeli romb na dva enakostranična trikotnika. Diagonala je zato dolga kot stranica: $300\,\mathrm{N}$.

Enako pokaže kosinusni izrek. Pripni $\vec F_2$ na konec $\vec F_1$: v nastalem trikotniku je kot med stranicama $\vec F_1$ in $\vec F_2$ enak $60^\circ$. Zato je $|\vec F|^2 = 300^2 + 300^2 - 2 \cdot 300 \cdot 300 \cdot \cos 60^\circ$, torej $|\vec F|^2 = 300^2$.

**Množenje s številom.** Kaj je $\vec a + \vec a$? Puščica, ki kaže enako, a je dvakrat daljša. Zapišemo jo $2\vec a$. Splošno je $k\vec a$ vektor, ki ga dobiš, ko vektor $\vec a$ pomnožiš s **skalarjem** $k$ (realnim številom). Po komponentah:

$$k\vec a = (k a_x,\ k a_y,\ k a_z)$$

Kaj naredi $k$ s puščico:

| $k$ | dolžina | usmerjenost |
|---|---|---|
| $k > 1$ | se poveča | ostane |
| $0 < k < 1$ | se zmanjša | ostane |
| $k = 0$ | $0$ (ničelni vektor $\vec 0$) | – |
| $k < 0$ | $\lvert k\rvert$-krat | se obrne |

Vektor $(-1)\vec a = -\vec a$ je **nasprotni vektor**: enako dolg, kaže v obratno stran. Z njim odštevamo: $\vec a - \vec b = \vec a + (-\vec b)$.

Vektorja, ki ležita na vzporednih premicah, imenujemo **kolinearna**; takrat je $\vec b = k\vec a$ za neko število $k$ (če $\vec a$ ni ničelni vektor). Izraz $k\vec a + m\vec b$ imenujemo **linearna kombinacija** vektorjev $\vec a$ in $\vec b$.

:::premisli
Sošolec zapiše: dolžina vektorja $k\vec a$ je $k \cdot |\vec a|$. Preizkusi to pri $k = -2$. Kaj gre narobe in kako se zapiše pravilno?
---
Dolžina ne more biti negativna. Pri $k = -2$ je puščica dvakrat daljša, le obrnjena, zato je njena dolžina $2|\vec a|$. Predznak števila $k$ vpliva na usmerjenost, absolutna vrednost na dolžino.
:::

Odpri simulacijo »Seštevanje in množenje vektorjev« spodaj in vleci konca vektorjev $\vec a$ in $\vec b$. Poskusi doseči, da je $|\vec a + \vec b| = |\vec a| + |\vec b|$, nato da je $\vec a + \vec b$ ničelni vektor. Pri izbiri $k \cdot \vec a$ premikaj drsnik čez $0$ in opazuj, kdaj se puščica obrne.

**Koordinatni sistem in krajevni vektor.** Pravokotni koordinatni sistem v ravnini sestavljata dve pravokotni številski premici, os $x$ in os $y$, s skupnim izhodiščem $O$ in enako enoto. V prostoru dodamo tretjo os $z$, pravokotno na obe: osi $x$ in $y$ ležita na tleh, os $z$ kaže navzgor. Točka v prostoru ima tri koordinate, na primer $T(x, y, z)$.

**Krajevni vektor** točke $T$ je vektor $\vec r_T = \overrightarrow{OT}$ od izhodišča do točke. Njegove komponente so kar koordinate točke. Žoga iz uvodnega primera ima na koncu krajevni vektor $(15, 9)$. Vektor med dvema točkama je razlika krajevnih vektorjev:

$$\overrightarrow{AB} = \vec r_B - \vec r_A$$

Dron vzleti s tal v točki $A(1, 2, 0)$ in prileti v točko $B(4, 6, 12)$, koordinate so v metrih. Njegov premik je $\overrightarrow{AB} = (4 - 1,\ 6 - 2,\ 12 - 0) = (3, 4, 12)$, dolg $\sqrt{9 + 16 + 144} = 13\,\mathrm{m}$.

**Baza.** Vektorja $\vec a$ in $\vec b$ v ravnini, ki nista kolinearna, tvorita **bazo ravnine**. Vsak vektor ravnine lahko zapišemo kot linearno kombinacijo $k\vec a + m\vec b$, in to na en sam način. Števili $k$ in $m$ sta koeficienta vektorja v tej bazi. V prostoru bazo tvorijo trije vektorji, ki niso koplanarni: narisani iz iste točke ne ležijo v isti ravnini. Vsak vektor prostora je potem na en sam način enak $k\vec a + m\vec b + n\vec c$. Najbolj priročna je **standardna baza** iz enotskih vektorjev v smereh osi; v njej so koeficienti kar komponente $a_x$, $a_y$, $a_z$ (glej »Bolj natančno«). Primer 4 spodaj razvije vektor $(9, 4)$ po bazi $(1, 2)$, $(3, -1)$.

**Razstavljanje sile na dani smeri.** Seštevanje lahko obrnemo. Dani sta sila $\vec F$ in dve smeri. Skozi začetek sile narišemo premici v teh smereh, skozi konico pa vzporednici z njima. Nastane paralelogram, katerega stranici sta **komponenti** sile, $\vec F_1$ in $\vec F_2$:

$$\vec F = \vec F_1 + \vec F_2$$

To je razvoj sile po bazi iz vektorjev v danih smereh. Dva vlačilca vlečeta ladjo v smereh $(3, 1)$ in $(1, 2)$, skupna sila mora biti $\vec F = (50, 50)\,\mathrm{kN}$. Na sliki je ena enota $10\,\mathrm{kN}$:

:::risba skica
opis: Sila F od izhodišča O do točke (5, 5), ena enota je 10 kN. Sivi črtkani premici skozi O kažeta smeri vlačilcev, v smeri (3, 1) in v smeri (1, 2). Iz konice sile gresta črtkani vzporednici do točk (3, 1) in (2, 4). Nastane paralelogram s stranicama F₁ od O do (3, 1) in F₂ od O do (2, 4); sila F je njegova diagonala.
območje: -0,5; -0,5 .. 6,5; 5,8
enota: 40
mreža: da
črta: 0; 0 -> 6; 2 | siva črtkano
črta: 0; 0 -> 2,8; 5,6 | siva črtkano
črta: 3; 1 -> 5; 5 -> 2; 4 | siva črtkano
puščica: 0; 0 -> 3; 1 | F_1 | pod | modra
puščica: 0; 0 -> 2; 4 | F_2 | levo | oranžna
puščica: 0; 0 -> 5; 5 | F | desno | zelena
točka: 0; 0 | O | levo
:::

S slike odčitamo $\vec F_1 = (30, 10)\,\mathrm{kN}$ in $\vec F_2 = (20, 40)\,\mathrm{kN}$; računsko to preveri Primer 5. Kadar sta smeri pravokotni, je vsaka komponenta pravokotna projekcija sile na svojo smer.

## Rešeni primeri

### Primer 1: Dva teka in podaja

Na taktični tabli je narisan tek igralca $\vec a = (4, -1)\,\mathrm{m}$, ki ga igralec ponovi dvakrat, nato pa še premik $\vec b = (-2, 3)\,\mathrm{m}$. Kateri vektor opiše njegov skupni premik in kako daleč je od začetne točke?

**Podatki:** $\vec a = (4, -1)\,\mathrm{m}$, $\vec b = (-2, 3)\,\mathrm{m}$, tek $\vec a$ dvakrat
**Iščemo:** skupni premik $\vec s = 2\vec a + \vec b$ in njegovo dolžino $|\vec s|$

:::formula
$\vec s = 2\vec a + \vec b = (2a_x + b_x,\ 2a_y + b_y)$, $|\vec s| = \sqrt{s_x^2 + s_y^2}$
:::

**Rešitev:**

1. Najprej množenje s skalarjem: $2\vec a = (2 \cdot 4,\ 2 \cdot (-1)) = (8, -2)$.
2. Nato seštevanje po komponentah: $\vec s = (8 + (-2),\ -2 + 3) = (6, 1)$.
3. Dolžina: $|\vec s| = \sqrt{6^2 + 1^2} = \sqrt{37} \approx 6{,}08$.
4. Odgovor: skupni premik je $\vec s = (6, 1)\,\mathrm{m}$; igralec je približno $6{,}1\,\mathrm{m}$ od začetne točke.

### Primer 2: Dron nad igriščem

Dron, ki snema tekmo, se najprej premakne za $\vec a = (6, 2, 3)\,\mathrm{m}$, nato dvakrat zapored za $\vec b = (-2, 4, -1)\,\mathrm{m}$. Tretja komponenta je višina. Kakšen je skupni premik in kako daleč je dron od začetne lege?

**Podatki:** $\vec a = (6, 2, 3)\,\mathrm{m}$, $\vec b = (-2, 4, -1)\,\mathrm{m}$, premik $\vec b$ dvakrat
**Iščemo:** $\vec s = \vec a + 2\vec b$ in $|\vec s|$

:::formula
$\vec s = \vec a + 2\vec b$, $|\vec s| = \sqrt{s_x^2 + s_y^2 + s_z^2}$
:::

**Rešitev:**

1. $2\vec b = (-4, 8, -2)$, vsako komponento pomnožimo z $2$.
2. $\vec s = (6 - 4,\ 2 + 8,\ 3 - 2) = (2, 10, 1)$.
3. Dolžina: $|\vec s| = \sqrt{2^2 + 10^2 + 1^2} = \sqrt{105} \approx 10{,}25$.
4. Odgovor: dron se je premaknil za $(2, 10, 1)\,\mathrm{m}$; od začetne lege je približno $10{,}2\,\mathrm{m}$. Na koncu je $1\,\mathrm{m}$ višje kot na začetku.

### Primer 3: Kajak čez reko (dva koraka)

Kajakaš vesla pravokotno na breg s hitrostjo $3\,\mathrm{m/s}$ glede na vodo. Reka teče vzporedno z bregom s hitrostjo $1{,}2\,\mathrm{m/s}$ in je široka $60\,\mathrm{m}$. S kolikšno hitrostjo se kajak giblje glede na breg? Koliko ga reka odnese, preden pride na drugo stran? Komponente z decimalno vejico ločimo s podpičjem, da se ne pomešajo.

**Podatki:** hitrost kajaka glede na vodo $\vec v_k = (0;\ 3)\,\mathrm{m/s}$, hitrost reke $\vec v_r = (1{,}2;\ 0)\,\mathrm{m/s}$, širina reke $60\,\mathrm{m}$ (os $x$ vzdolž brega, os $y$ čez reko)
**Iščemo:** hitrost $\vec v$ glede na breg, njeno velikost $|\vec v|$ in odmik vzdolž brega

:::formula
$\vec v = \vec v_k + \vec v_r$, premik $\vec s = t \cdot \vec v$
:::

**Rešitev:**

1. Hitrosti seštejemo: $\vec v = (0 + 1{,}2;\ 3 + 0) = (1{,}2;\ 3)\,\mathrm{m/s}$.
2. Velikost: $|\vec v| = \sqrt{1{,}2^2 + 3^2} = \sqrt{10{,}44} \approx 3{,}23\,\mathrm{m/s}$.
3. Čas prečkanja določa le komponenta čez reko: $t = \dfrac{60\,\mathrm{m}}{3\,\mathrm{m/s}} = 20\,\mathrm{s}$. Tok kajaka ne upočasni, ker teče pravokotno na to smer.
4. Premik je vektor $\vec v$, pomnožen s skalarjem $t$: $\vec s = 20 \cdot (1{,}2;\ 3) = (24;\ 60)\,\mathrm{m}$.
5. Odgovor: kajak se giblje s hitrostjo približno $3{,}23\,\mathrm{m/s}$; reka ga odnese $24\,\mathrm{m}$ niže ob bregu.

### Primer 4 – zdaj ti

V računalniški igri se lik premika le z dvema ukazoma: korak $\vec a = (1, 2)$ in skok $\vec b = (3, -1)$. Lik mora iz izhodišča priti v točko $(9, 4)$. Kolikokrat mora narediti korak in kolikokrat skok?

**Podatki:** $\vec a = (1, 2)$, $\vec b = (3, -1)$, cilj $\vec c = (9, 4)$
**Iščemo:** števili $k$ in $m$, da je $k\vec a + m\vec b = \vec c$

:::formula
$k\vec a + m\vec b = \vec c$, po komponentah: $k a_x + m b_x = c_x$ in $k a_y + m b_y = c_y$
:::

**Rešitev:**

1. Komponenta $x$: $k + 3m = 9$.
2. Komponenta $y$: $2k - m = 4$, od tod $m = 2k - 4$.
3. Vstavi $m$ v prvo enačbo, izračunaj $k$ in $m$ ter preveri:

:::premisli
Kolikšna sta $k$ in $m$?
---
$k + 3(2k - 4) = 9$, torej $7k = 21$ in $k = 3$. Potem je $m = 2 \cdot 3 - 4 = 2$. Preizkus: $3 \cdot (1, 2) + 2 \cdot (3, -1) = (3 + 6,\ 6 - 2) = (9, 4)$. Lik naredi tri korake in dva skoka.
:::

### Primer 5: dva vlačilca

Ladjo morata vlačilca premakniti s skupno silo $\vec F = (50, 50)\,\mathrm{kN}$. Prvi vleče v smeri $\vec a = (3, 1)$, drugi v smeri $\vec b = (1, 2)$. S kolikšno silo mora vleči vsak?

**Podatki:** $\vec F = (50, 50)\,\mathrm{kN}$, smeri $\vec a = (3, 1)$ in $\vec b = (1, 2)$
**Iščemo:** komponenti $\vec F_1 = k\vec a$ in $\vec F_2 = m\vec b$ ter njuni velikosti

:::formula
$\vec F = k\vec a + m\vec b$, po komponentah: $k a_x + m b_x = F_x$ in $k a_y + m b_y = F_y$
:::

**Rešitev:**

1. Komponenta $x$: $3k + m = 50$, od tod $m = 50 - 3k$.
2. Komponenta $y$: $k + 2m = 50$. Vstavimo: $k + 100 - 6k = 50$, torej $5k = 50$ in $k = 10$. Potem je $m = 50 - 30 = 20$.
3. Komponenti: $\vec F_1 = 10 \cdot (3, 1) = (30, 10)\,\mathrm{kN}$ in $\vec F_2 = 20 \cdot (1, 2) = (20, 40)\,\mathrm{kN}$. Preizkus: $(30 + 20,\ 10 + 40) = (50, 50)$.
4. Velikosti: $|\vec F_1| = \sqrt{30^2 + 10^2} = \sqrt{1000} \approx 31{,}6\,\mathrm{kN}$ in $|\vec F_2| = \sqrt{20^2 + 40^2} = \sqrt{2000} \approx 44{,}7\,\mathrm{kN}$.
5. Odgovor: prvi vlačilec vleče s silo približno $31{,}6\,\mathrm{kN}$, drugi s silo približno $44{,}7\,\mathrm{kN}$. Skupaj je to $76{,}3\,\mathrm{kN}$, ladja pa dobi le $|\vec F| = \sqrt{5000} \approx 70{,}7\,\mathrm{kN}$. Ker vlečeta vsak malo vstran, se del truda izniči, kot pri saneh.

## Pogoste napake

- **Dolžini se kar seštejeta.** Napačno: $|\vec a + \vec b| = |\vec a| + |\vec b|$, zato bi dve sili po $300\,\mathrm{N}$ dali $600\,\mathrm{N}$. To velja le za enako usmerjena vektorja. Seštej komponente in šele nato izračunaj dolžino.
- **Skalar le pri prvi komponenti.** Pri $3 \cdot (2, -3, 1)$ nekdo zapiše $(6, -3, 1)$. Število $k$ raztegne celo puščico, zato pomnoži *vsako* komponento: $(6, -9, 3)$.
- **Minus pred negativno komponento.** Pri $\vec a - \vec b$ z $a_x = 6$ in $b_x = -1$ izračunaš $6 - 1$ namesto $6 - (-1) = 7$. Negativne komponente piši v oklepaju.
- **»Negativen $k$ naredi negativno dolžino.«** Dolžina je vedno nenegativna. Negativen $k$ obrne usmerjenost, dolžina pa je $|k| \cdot |\vec a|$.

## Povzetek

- Vektor ima dolžino, smer in usmerjenost; enaki puščici na različnih mestih sta isti vektor.
- Vsota: pravilo trikotnika (puščico pripneš na konec prve) ali pravilo paralelograma (diagonala).
- Po komponentah: $\vec a + \vec b = (a_x + b_x,\ a_y + b_y,\ a_z + b_z)$, $k\vec a = (ka_x,\ ka_y,\ ka_z)$.
- Dolžina: $|\vec a| = \sqrt{a_x^2 + a_y^2 + a_z^2}$; v ravnini brez $a_z$.
- $|\vec a + \vec b| \le |\vec a| + |\vec b|$; enakost le pri enako usmerjenih vektorjih.
- $k < 0$ obrne usmerjenost, $|k\vec a| = |k| \cdot |\vec a|$; $\vec a - \vec b = \vec a + (-\vec b)$.
- Krajevni vektor $\vec r_T = \overrightarrow{OT}$ ima za komponente koordinate točke $T$; $\overrightarrow{AB} = \vec r_B - \vec r_A$.
- Bazo ravnine tvorita dva nekolinearna vektorja, bazo prostora trije nekoplanarni. Razstavljanje sile na dani smeri je razvoj po bazi (paralelogram).

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Vektorja $\vec a = (2, p, -3)$ in $\vec b = (q, 6, 9)$ sta kolinearna. Izračunaj števili $p$ in $q$.

**Rešitev:**

1. Vektor $\vec a$ ni ničelen in vektorja sta kolinearna, zato je $\vec b = k\vec a$ za neko število $k$. Po komponentah: $q = 2k$, $6 = kp$ in $9 = -3k$.
2. Iz tretje komponente: $k = \frac{9}{-3} = -3$.
3. Potem je $q = 2 \cdot (-3) = -6$, iz $6 = -3p$ pa sledi $p = -2$.
4. Preizkus: $\vec a = (2, -2, -3)$ in $\vec b = (-6, 6, 9) = -3\vec a$.
5. Odgovor: $p = -2$, $q = -6$.

**Točkovanje:** 1 točka za zapis $\vec b = k\vec a$ po komponentah, 1 točka za $k = -3$, 1 točka za $p = -2$ in $q = -6$.

### Naloga 2: krajša strukturirana naloga, 8 točk, pola 1 (brez računala)

Dane so točke $A(1, 0, 2)$, $B(3, 2, 3)$ in $C(1, 3, 5)$.

a) Izračunaj vektorja $\overrightarrow{AB}$ in $\overrightarrow{BC}$. (1 točka)
b) Določi koordinate točke $D$, da bo štirikotnik $ABCD$ paralelogram. (2 točki)
c) Izračunaj dolžini stranic $AB$ in $BC$ ter dolžino diagonale $AC$. Utemelji, da je paralelogram $ABCD$ kvadrat. (3 točke)
d) Dana je še točka $E(3, 5, 6)$. Zapiši vektor $\overrightarrow{AE}$ kot linearno kombinacijo vektorjev $\overrightarrow{AB}$ in $\overrightarrow{BC}$ ter utemelji, da točka $E$ leži v ravnini paralelograma $ABCD$. (2 točki)

**Rešitev:**

1. a) $\overrightarrow{AB} = (3 - 1,\ 2 - 0,\ 3 - 2) = (2, 2, 1)$ in $\overrightarrow{BC} = (1 - 3,\ 3 - 2,\ 5 - 3) = (-2, 1, 2)$.
2. b) V paralelogramu $ABCD$ je $\overrightarrow{AD} = \overrightarrow{BC}$. Krajevni vektor točke $D$ (vektor od izhodišča $O$ do $D$) je zato $\overrightarrow{OD} = \overrightarrow{OA} + \overrightarrow{BC} = (1 - 2,\ 0 + 1,\ 2 + 2) = (-1, 1, 4)$.
3. b) Preizkus: $\overrightarrow{DC} = (1 + 1,\ 3 - 1,\ 5 - 4) = (2, 2, 1)$, kar je enako $\overrightarrow{AB}$.
4. c) $|\overrightarrow{AB}| = \sqrt{2^2 + 2^2 + 1^2} = \sqrt{9} = 3$ in $|\overrightarrow{BC}| = \sqrt{(-2)^2 + 1^2 + 2^2} = \sqrt{9} = 3$.
5. c) $\overrightarrow{AC} = (1 - 1,\ 3 - 0,\ 5 - 2) = (0, 3, 3)$, zato je $|\overrightarrow{AC}| = \sqrt{0 + 9 + 9} = \sqrt{18} = 3\sqrt{2}$.
6. c) Nasprotni stranici paralelograma sta enako dolgi, sosednji stranici $AB$ in $BC$ pa sta tudi enako dolgi, zato vse štiri stranice merijo $3$ in je $ABCD$ romb. Ker je $|\overrightarrow{AB}|^2 + |\overrightarrow{BC}|^2 = 9 + 9 = 18 = |\overrightarrow{AC}|^2$, je po obratu Pitagorovega izreka kot pri oglišču $B$ pravi. Romb s pravim kotom je kvadrat. (Pravi kot pri $B$ pokaže tudi skalarni produkt $\overrightarrow{AB} \cdot \overrightarrow{BC} = -4 + 2 + 2 = 0$.)
7. d) $\overrightarrow{AE} = (3 - 1,\ 5 - 0,\ 6 - 2) = (2, 5, 4)$. Iščemo števili $k$ in $m$, da je $k\overrightarrow{AB} + m\overrightarrow{BC} = \overrightarrow{AE}$. Po komponentah: $2k - 2m = 2$, $2k + m = 5$ in $k + 2m = 4$.
8. d) Prvo enačbo odštejemo od druge: $3m = 3$, torej $m = 1$ in $k = 2$. Tudi tretja enačba drži: $2 + 2 \cdot 1 = 4$. Zato je $\overrightarrow{AE} = 2\overrightarrow{AB} + \overrightarrow{BC}$.
9. d) Vektor $\overrightarrow{AE}$ je linearna kombinacija vektorjev $\overrightarrow{AB}$ in $\overrightarrow{AD} = \overrightarrow{BC}$, zato so ti trije vektorji koplanarni. Točka $E$ torej leži v ravnini skozi $A$, ki jo določata stranici $AB$ in $AD$, to je v ravnini paralelograma.
10. Odgovor: a) $\overrightarrow{AB} = (2, 2, 1)$, $\overrightarrow{BC} = (-2, 1, 2)$; b) $D(-1, 1, 4)$; c) $|\overrightarrow{AB}| = |\overrightarrow{BC}| = 3$, $|\overrightarrow{AC}| = 3\sqrt{2}$, $ABCD$ je kvadrat (vse stranice merijo $3$, kot pri $B$ je pravi); d) $\overrightarrow{AE} = 2\overrightarrow{AB} + \overrightarrow{BC}$, točka $E$ leži v ravnini paralelograma.

**Točkovanje:** a) 1 točka za oba vektorja; b) 1 točka za zvezo $\overrightarrow{AD} = \overrightarrow{BC}$ (ali $\overrightarrow{OD} = \overrightarrow{OA} + \overrightarrow{BC}$), 1 točka za $D(-1, 1, 4)$; c) 1 točka za obe dolžini stranic $3$, 1 točka za $|\overrightarrow{AC}| = 3\sqrt{2}$, 1 točka za utemeljitev (enake stranice in pravi kot pri $B$, z obratom Pitagorovega izreka ali z $\overrightarrow{AB} \cdot \overrightarrow{BC} = 0$) in sklep, da je $ABCD$ kvadrat; d) 1 točka za $k = 2$ in $m = 1$ iz sistema, 1 točka za preverjeno tretjo enačbo in sklep o ravnini.

### Ustno vprašanje 1

:::premisli
Kdaj sta dva vektorja kolinearna in kdaj so trije vektorji koplanarni?
---
Vektorja sta kolinearna, če ležita na isti ali na vzporednih premicah. Če je $\vec a \ne \vec 0$, sta $\vec a$ in $\vec b$ kolinearna natanko tedaj, ko je $\vec b = k\vec a$ za neko realno število $k$. Trije vektorji so koplanarni, če jih, narisane iz skupne točke, lahko položimo v isto ravnino. Če $\vec a$ in $\vec b$ nista kolinearna, so $\vec a$, $\vec b$ in $\vec c$ koplanarni natanko tedaj, ko je $\vec c = k\vec a + m\vec b$ za neki realni števili $k$ in $m$. Trije vektorji, ki niso koplanarni, tvorijo bazo prostora.
:::

### Ustno vprašanje 2

:::premisli
Opiši pravilo trikotnika in pravilo paralelograma za seštevanje vektorjev ter utemelji, da je seštevanje vektorjev komutativno.
---
Po pravilu trikotnika drugi vektor vzporedno premaknemo, da začne v končni točki prvega; vsota je vektor od začetka prvega do konca drugega. Po pravilu paralelograma oba vektorja narišemo iz iste točke in ju dopolnimo do paralelograma; vsota je diagonala iz skupnega začetka. Nasprotni stranici paralelograma predstavljata isti vektor, zato po eni poti ob robu dobimo $\vec a + \vec b$, po drugi pa $\vec b + \vec a$. Obe poti se končata v istem oglišču, zato je $\vec a + \vec b = \vec b + \vec a$.
:::

### Ustno vprašanje 3

:::premisli
Navedi primer baze ravnine, ki je ne sestavljata enotska vektorja v smereh osi, in po njej razstavi en vektor.
---
Bazo ravnine tvorita poljubna nekolinearna vektorja, na primer $\vec a = (1, 1)$ in $\vec b = (1, -1)$, saj noben ni večkratnik drugega. Vsak vektor ravnine lahko na en sam način zapišemo kot linearno kombinacijo $k\vec a + m\vec b$ baznih vektorjev. Za vektor $\vec c = (5, 1)$ iz $k\vec a + m\vec b = \vec c$ po komponentah dobimo sistem $k + m = 5$ in $k - m = 1$. Od tod je $k = 3$ in $m = 2$, torej $\vec c = 3\vec a + 2\vec b$, kar potrdi preizkus $3 \cdot (1, 1) + 2 \cdot (1, -1) = (5, 1)$.
:::

## Drugače: Z analogijo

Vektor je kot **navodilo na zemljevidu zaklada**: »3 korake proti vzhodu, 1 proti severu«. Navodilo ne pove, kje stojiš. Pove le, kako se premakneš. Zato je isto navodilo, izvedeno na dveh krajih, isti vektor.

- **Seštevanje** pomeni, da navodili izvedeš zapored. Vrstni red ni pomemben: v obeh primerih končaš na istem mestu.
- **Množenje s $k = 3$** pomeni, da navodilo ponoviš trikrat. Pri $k = \frac{1}{2}$ narediš le pol vsakega koraka.
- **Negativen $k$** pomeni, da navodilo izvedeš vzvratno: hodiš proti zahodu in jugu.
- **Dolžina** je zračna razdalja od začetka do konca, ne število korakov, ki si jih naredil.

## Drugače: Bolj natančno

**Vektor kot razred puščic.** Matematično je vektor množica vseh usmerjenih daljic, ki se ujemajo v dolžini, smeri in usmerjenosti. Vsaka puščica je le en predstavnik. Zato smemo vektor narisati iz poljubne točke.

**Pravila računanja.** Za vse vektorje $\vec a$, $\vec b$, $\vec c$ in števila $k$, $m$ velja:

- $\vec a + \vec b = \vec b + \vec a$ in $(\vec a + \vec b) + \vec c = \vec a + (\vec b + \vec c)$,
- $\vec a + \vec 0 = \vec a$ in $\vec a + (-\vec a) = \vec 0$,
- $k(\vec a + \vec b) = k\vec a + k\vec b$ in $(k + m)\vec a = k\vec a + m\vec a$,
- $k(m\vec a) = (km)\vec a$ in $1 \cdot \vec a = \vec a$.

Vsa sledijo iz pravil za realna števila, ker računamo po komponentah.

**Baza.** Z $\vec i = (1, 0, 0)$, $\vec j = (0, 1, 0)$ in $\vec k = (0, 0, 1)$ označimo enotske vektorje v smereh osi. Vsak vektor je njihova linearna kombinacija: $\vec a = a_x\vec i + a_y\vec j + a_z\vec k$. Komponente so torej koeficienti v tem zapisu.

**Trikotniška neenakost.** Vektorji $\vec a$, $\vec b$ in $\vec a + \vec b$ tvorijo trikotnik. V trikotniku je vsaka stranica krajša od vsote drugih dveh, zato je $|\vec a + \vec b| \le |\vec a| + |\vec b|$. Enakost velja le, ko se trikotnik »splošči« v daljico, torej pri enako usmerjenih vektorjih.

## Preveri se

? Na taktični tabli sta narisani puščici, ki predstavljata premika dveh igralcev. Kdaj predstavljata isti vektor?
- Kadar se začneta v isti točki.
~ Začetna točka ni lastnost vektorja. Puščico lahko vzporedno premaknemo, vektor ostane isti.
+ Kadar imata enako dolžino, smer in usmerjenost, tudi če začneta na različnih mestih.
- Kadar sta enako dolgi.
~ Enako dolgi puščici lahko kažeta v povsem različne smeri, na primer naprej in nazaj.
- Kadar ležita na vzporednih premicah.
~ Vzporedni puščici imata isto smer, a sta lahko različno dolgi ali nasprotno usmerjeni.
> Vektor določajo dolžina, smer in usmerjenost. Kje puščica začne, ni pomembno.

? Dve sili po $5\,\mathrm{N}$ vlečeta isto telo. Kot med njima je $0^\circ$, $90^\circ$, $120^\circ$ ali $180^\circ$. Razvrsti primere od največje do najmanjše skupne sile.
+ $0^\circ$, $90^\circ$, $120^\circ$, $180^\circ$
- $180^\circ$, $120^\circ$, $90^\circ$, $0^\circ$
~ Večji kot ne pomeni večje vsote. Bolj ko sili kažeta narazen, bolj se izničita.
- $90^\circ$, $0^\circ$, $120^\circ$, $180^\circ$
~ Pravokotni sili se ne podpirata najbolj. Najbolj se podpirata, ko kažeta v isto smer.
- Vsi primeri dajo $10\,\mathrm{N}$.
~ Tako bi veljalo, če bi se velikosti kar seštele. Seštevamo vektorje, ne dolžin.
> Skupne sile so $10\,\mathrm{N}$; približno $7{,}07\,\mathrm{N}$; $5\,\mathrm{N}$ in $0\,\mathrm{N}$. Večji kot pomeni manjšo vsoto.

? Kaj se zgodi z vektorjem $\vec a$, če ga pomnožimo z $-2$?
- Postane dvakrat krajši.
~ Krajši postane pri $0 < |k| < 1$. Pri $|k| = 2$ je dvakrat daljši.
- Ohrani usmerjenost, njegova dolžina pa postane negativna.
~ Dolžina ne more biti negativna. Negativni predznak obrne usmerjenost.
+ Obrne se in postane dvakrat daljši.
- Obrne se le njegova prva komponenta.
~ Skalar pomnoži vse komponente, zato se obrne cela puščica.
> $|-2\vec a| = 2|\vec a|$, predznak minus pa obrne usmerjenost.

? Dana sta $\vec a = (2, -3, 1)$ in $\vec b = (-1, 4, 0)$. Koliko je $3\vec a - \vec b$?
- $(5, -5, 3)$
~ To je $3\vec a + \vec b$. Vektor $\vec b$ moraš odšteti.
- $(5, -13, 3)$
~ Pri prvi komponenti si izračunal $6 - 1$. Pravilno je $6 - (-1) = 7$.
- $(7, -13, 1)$
~ Tretje komponente nisi pomnožil s $3$. Skalar pomnoži vse komponente.
+ $(7, -13, 3)$
> $3\vec a = (6, -9, 3)$, nato $3\vec a - \vec b = (6 + 1,\ -9 - 4,\ 3 - 0) = (7, -13, 3)$.

? Plavalec plava pravokotno na tok reke s hitrostjo $1{,}5\,\mathrm{m/s}$ glede na vodo, reka teče s hitrostjo $2\,\mathrm{m/s}$. S kolikšno hitrostjo se giblje glede na breg?
- $3{,}5\,\mathrm{m/s}$
~ Velikosti si seštel, kot da bi hitrosti kazali v isto smer. Pravokotni hitrosti seštej kot vektorja.
- $0{,}5\,\mathrm{m/s}$
~ Razlika velikosti bi veljala le za nasprotni smeri. Tu sta hitrosti pravokotni.
+ $2{,}5\,\mathrm{m/s}$
- $6{,}25\,\mathrm{m/s}$
~ To je $|\vec v|^2$. Pozabil si koreniti.
> $\vec v = (2;\ 1{,}5)\,\mathrm{m/s}$, zato je $|\vec v| = \sqrt{2^2 + 1{,}5^2} = \sqrt{6{,}25} = 2{,}5\,\mathrm{m/s}$.

? (brez računala) Točki imata koordinati $A(2, -1, 3)$ in $B(5, 3, 3)$. Kolikšna je razdalja med njima, torej $|\overrightarrow{AB}|$?
= 5
~ 9,43 | Krajevna vektorja si seštel. Vektor $\overrightarrow{AB}$ je razlika $\vec r_B - \vec r_A$.
~ 6,56 | To je dolžina krajevnega vektorja točke $B$, torej razdalja $B$ od izhodišča.
> $\overrightarrow{AB} = \vec r_B - \vec r_A = (3, 4, 0)$, zato je $|\overrightarrow{AB}| = \sqrt{9 + 16 + 0} = 5$.

? Silo $\vec F = (8, 1)\,\mathrm{N}$ razstavimo na smeri baznih vektorjev $\vec a = (2, 1)$ in $\vec b = (1, -1)$, torej $\vec F = k\vec a + m\vec b$. Koliko je $k$?
= 3
~ 2 | To je $m$, koeficient pred $\vec b$. Iz $2k + m = 8$ in $k - m = 1$ sledi $3k = 9$.
> Po komponentah: $2k + m = 8$ in $k - m = 1$. Seštejemo: $3k = 9$, torej $k = 3$ in $m = 2$. Preizkus: $3 \cdot (2, 1) + 2 \cdot (1, -1) = (8, 1)$.

<<RACUN
resi: 9=-3*k | k | -3
resi: 6=-3*p | p | -2
vrednost: 2*(-3) | -6
vrednost: sqrt(2^2+2^2+1^2) | 3
vrednost: sqrt((-2)^2+1^2+2^2) | 3
vrednost: sqrt(0^2+3^2+3^2) | 3*sqrt(2)
vrednost: 3^2+3^2 | 18
vrednost: 2*(-2)+2*1+1*2 | 0
resi: 2*k-2*m=2, 2*k+m=5 | k, m | k=2, m=1
vrednost: 2+2*1 | 4
vrednost: 2*2-2*1 | 2
vrednost: 2*2+1 | 5
resi: k+m=5, k-m=1 | k, m | k=3, m=2
vrednost: 3*1+2*(-1) | 1
vrednost: sqrt(3^2+4^2+12^2) | 13
resi: 3*k+m=50, k+2*m=50 | k, m | k=10, m=20
vrednost: sqrt(30^2+10^2) | 31.6
vrednost: sqrt(20^2+40^2) | 44.7
vrednost: sqrt(1000)+sqrt(2000) | 76.3
vrednost: sqrt(50^2+50^2) | 70.7
vrednost: sqrt(3^2+4^2+0^2) | 5
vrednost: sqrt(7^2+2^2+6^2) | 9.43
vrednost: sqrt(5^2+3^2+3^2) | 6.56
resi: 2*k+m=8, k-m=1 | k, m | k=3, m=2
>>

:::simboli
\vec a, \vec b, \vec c | vektor | | | dolžina $\lvert\vec a\rvert = \sqrt{a_x^2 + a_y^2 + a_z^2}$
a_x, a_y, a_z | komponente vektorja $\vec a$ | | | premik vzdolž osi $x$, $y$, $z$
b_x, b_y, b_z | komponente vektorja $\vec b$ | | |
c_x, c_y | komponenti vektorja $\vec c$ | | |
k, m, n | skalarji (realna števila), koeficienti v bazi | | – | v primeru 4 število korakov in skokov, v primeru 5 koeficienta pred smerema vlačilcev
\vec s | skupni premik | | m | $\lvert\vec s\rvert$ je razdalja od začetne točke; v primeru 1 je $\vec s = 2\vec a + \vec b$, v primeru 2 $\vec a + 2\vec b$, v primeru 3 $t\vec v$
s_x, s_y, s_z | komponente premika $\vec s$ | | m |
\vec v | hitrost kajaka glede na breg | \vec v = \vec v_k + \vec v_r | m/s |
\vec v_k | hitrost kajaka glede na vodo | | m/s |
\vec v_r | hitrost reke | | m/s |
t | čas prečkanja | | s |
O | izhodišče koordinatnega sistema | |
\vec r_T, \vec r_A, \vec r_B | krajevni vektor točke $T$, $A$, $B$ | \vec r_T = \overrightarrow{OT} | | komponente so koordinate točke
A, B | točki (pri dronu začetna in končna lega) | | | $\overrightarrow{AB} = \vec r_B - \vec r_A$
\vec F | sila (v primeru 5 skupna sila vlačilcev) | \vec F = \vec F_1 + \vec F_2 | kN | pri saneh skupna sila atletov v N
\vec F_1, \vec F_2 | komponenti sile v danih smereh | | kN | pri saneh sili atletov v N
F_x, F_y | komponenti sile $\vec F$ | | kN |
:::
