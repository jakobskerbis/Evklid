---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Zdravnica ti izmeri temperaturo in reče: »Pod $38\,°\text{C}$ vročine še nimaš.« Katera je torej najvišja temperatura brez vročine? $37{,}9$? Ne, $37{,}99$ je višja in še vedno pod mejo. Pa $37{,}999$? Vsakemu kandidatu lahko pripišeš še eno devetko in dobiš višje število, ki je še pod $38$. Sliši se čudno, a drži: **najvišje take temperature ni**.

Številska premica skriva še eno presenečenje. Racionalna števila so na njej gosta, med dvema vedno leži še tretje. Pa vendar premice ne zapolnijo. Kvadrat s stranico $1\,\text{cm}$ ima po Pitagorovem izreku diagonalo $d$, za katero velja $d^2 = 1^2 + 1^2 = 2$. Diagonala ima neko dolžino, ulomka, ki bi pomnožen sam s seboj dal $2$, pa ni. Premica ima »luknje«, ki jih zapolnijo šele **realna števila** $\mathbb{R}$.

Na laboratorijskem izvidu krvi ima vsaka vrednost ob sebi **referenčno območje**, npr. za kalij od $3{,}5$ do $5{,}1\,\text{mmol/L}$. Takemu območju rečemo **interval**. Zdravnika zanima še, kako daleč je izmerjena vrednost od sredine območja, ne glede na to, ali je nad njo ali pod njo. To pove **absolutna vrednost**. Z intervali boš zapisoval tudi rešitve neenačb in definicijska območja funkcij.

## Razlaga

**1. Iracionalna in realna števila.** Mamljivo je misliti, da je vsako število ulomek, saj so ulomki na premici povsod. Diagonala iz uvoda to ovrže. Število, ki ni racionalno, imenujemo **iracionalno**. Primera sta $\sqrt{2} = 1{,}41421356\ldots$ in $\pi = 3{,}14159265\ldots$. Decimalni zapis racionalnega števila je končen ali periodičen. Decimalni zapis iracionalnega števila je neskončen in **neperiodičen**. Množico iracionalnih števil označimo z $\mathbb{I}$ (zapišemo jo tudi kot $\mathbb{R} \setminus \mathbb{Q}$). Skupaj z racionalnimi tvorijo **realna števila**:

$$\mathbb{R} = \mathbb{Q} \cup \mathbb{I}, \qquad \mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}.$$

Vsakemu realnemu številu pripada natanko ena točka na številski premici in vsaki točki natanko eno realno število. Za računanje in primerjanje veljajo ista pravila kot pri racionalnih številih.

Koren naravnega števila je celo število, če je število popoln kvadrat ($\sqrt{9} = 3$, $\sqrt{16} = 4$), sicer je iracionalen ($\sqrt{2}$, $\sqrt{3}$, $\sqrt{5}$). Iracionalnega števila ne moremo zapisati natančno z decimalkami, zato računamo s približki. Ocenimo $\sqrt{2}$: ker je $1{,}41^2 = 1{,}9881$ in $1{,}42^2 = 2{,}0164$, velja $1{,}41 < \sqrt{2} < 1{,}42$.

**2. Absolutna vrednost.** Pogosta prva misel je: »absolutna vrednost pobriše minus«. Pri $|-5| = 5$ to deluje. V zapisu $|x|$ pa minusa ni, zato bi »brisanje« dalo $|x| = x$. Za $x = -5$ bi bilo to $-5$, razdalja pa ne more biti negativna. Popravek je v pomenu: absolutna vrednost števila $x$ je njegova **razdalja od $0$** na številski premici:

$$|x| = \begin{cases} x, & x \ge 0 \\ -x, & x < 0 \end{cases}$$

Absolutna vrednost je torej vedno nenegativna. Primeri: $|5| = 5$, $|-5| = 5$, $|0| = 0$. Pri $|\sqrt{2} - 2|$ je izraz znotraj absolutne vrednosti negativen, ker je $\sqrt{2} < 2$, zato je $|\sqrt{2} - 2| = 2 - \sqrt{2}$.

:::premisli
Za katera števila $x$ velja $|x| = -x$? Napovej, preden pogledaš.
---
Za vsa $x \le 0$. Pri negativnem $x$ je $-x$ pozitivno in enako razdalji od $0$, npr. pri $x = -4$ je $|-4| = 4 = -(-4)$. Velja tudi za $x = 0$. Za pozitivni $x$ ne velja, ker bi bila desna stran negativna.
:::

**Razdalja** med točkama, ki jima na premici pripadata števili $a$ in $b$ (njuni **abscisi**), je $|a - b| = |b - a|$. Lastnosti:

- $|x| \ge 0$ in $|x| = 0$ natanko tedaj, ko je $x = 0$,
- $|-x| = |x|$,
- $|a \cdot b| = |a| \cdot |b|$ in $\left|\dfrac{a}{b}\right| = \dfrac{|a|}{|b|}$ za $b \neq 0$,
- trikotniška neenakost: $|a + b| \le |a| + |b|$.

**Enačba z absolutno vrednostjo.** Enačba $|x| = a$ pomeni »točka $x$ je od $0$ oddaljena za $a$«:

- za $a > 0$ sta rešitvi $x = a$ in $x = -a$,
- za $a = 0$ je edina rešitev $x = 0$,
- za $a < 0$ rešitve ni, ker absolutna vrednost ni negativna.

Podobno je $|x - c| = r$ ($r > 0$) enačba točk, ki so od $c$ oddaljene za $r$: $x = c - r$ ali $x = c + r$.

**3. Intervali.** **Interval** je množica **vseh** realnih števil med dvema **krajiščema** $a$ in $b$ ($a < b$). Zapis $[2, 5]$ torej ne pomeni le »števila $2, 3, 4, 5$«, ampak vsebuje tudi $2{,}5$, $\pi$ in $\sqrt{10}$. Krajišče je lahko vključeno ali izključeno. Interval je lahko tudi neomejen, če se razteza v neskončnost.

| Interval | Neenačba | Ime | Na številski premici |
|---|---|---|---|
| $(a, b)$ | $a < x < b$ | odprti | oba prazna krožca |
| $[a, b]$ | $a \le x \le b$ | zaprti | oba polna krožca |
| $[a, b)$ | $a \le x < b$ | polodprti | poln pri $a$, prazen pri $b$ |
| $(a, b]$ | $a < x \le b$ | polodprti | prazen pri $a$, poln pri $b$ |
| $(a, \infty)$ | $x > a$ | neomejeni | prazen krožec, puščica v desno |
| $[a, \infty)$ | $x \ge a$ | neomejeni | poln krožec, puščica v desno |
| $(-\infty, b)$ | $x < b$ | neomejeni | prazen krožec, puščica v levo |
| $(-\infty, b]$ | $x \le b$ | neomejeni | poln krožec, puščica v levo |
| $(-\infty, \infty)$ | vsak $x$ | cela premica | $\mathbb{R}$ |

Pravila za zapis:

- **Okrogel oklepaj** pomeni, da krajišče **ni** v množici (strogi znak $<$ ali $>$).
- **Oglat oklepaj** pomeni, da krajišče **je** v množici ($\le$ ali $\ge$).
- Znaka $\infty$ in $-\infty$ nista števili, zato ob njiju vedno pišemo okrogel oklepaj.
- Dolžina intervala je $b - a$, njegovo središče pa $\dfrac{a + b}{2}$.
- Kadar so v intervalu decimalna števila, krajišči ločimo s podpičjem: $[3{,}5\,;\,5{,}1]$.

Zdaj se paradoks iz uvoda razjasni. Temperature brez vročine so tiste s $t < 38$, desno krajišče $38$ ni vključeno. Za vsako tako temperaturo $t$ je število $\dfrac{t + 38}{2}$ bližje $38$ in še vedno manjše od $38$. Zato največjega elementa ni. Pri pogoju $t \le 38$ bi bil največji element ravno $38$.

**4. Operacije z intervali.** Intervali so množice, zato zanje veljajo operacije iz lekcije o množicah: **presek** $A \cap B$ (elementi, ki so v obeh), **unija** $A \cup B$ (elementi, ki so v vsaj eni) in **razlika** $A \setminus B$ (elementi iz $A$, ki niso v $B$). Za $A = [1, 5]$ in $B = (3, 8)$ je

$$A \cap B = (3, 5], \qquad A \cup B = [1, 8), \qquad A \setminus B = [1, 3].$$

Če se intervala ne dotikata, unija ostane iz dveh delov, npr. $(-\infty, -2) \cup (3, \infty)$. Vedno nariši oba intervala na isto premico in preveri krajišči.

V simulaciji spodaj »Intervali, unija in presek« nastavi $A$ od $1$ do $5$ in $B$ od $3$ do $8$ ($B$ je tam vedno zaprt) ter izberi $\cap$. Nato izklopi »A vsebuje desno krajišče«. Opazuj, kako se presek iz $[3, 5]$ spremeni v $[3, 5)$: krajišče ostane v preseku le, če je v obeh intervalih.

**5. Absolutna vrednost in intervali.** Kdor reši $|x| > 3$ kot $x > 3$, izgubi polovico rešitev: tudi $-4$ je od $0$ oddaljen za več kot $3$. Pogoj $|x - c| < r$ pomeni »$x$ je od $c$ oddaljen za manj kot $r$«. Zato leži $x$ na intervalu s središčem $c$ in polmerom $r$:

- $|x - c| < r \iff c - r < x < c + r \iff x \in (c - r,\, c + r)$,
- $|x - c| \le r \iff x \in [c - r,\, c + r]$,
- $|x - c| > r \iff x \in (-\infty,\, c - r) \cup (c + r,\, \infty)$,
- $|x - c| \ge r \iff x \in (-\infty,\, c - r] \cup [c + r,\, \infty)$.

Zapomni si: »manj kot« pomeni **med** (en kos), »več kot« pomeni **zunaj** (dva kosa). Primer: $|x - 2| < 3$ da $x \in (-1, 5)$.

:::premisli
Iz koliko kosov je rešitev neenačbe $|x - 4| \ge 1$? Ali je število $4$ v njej? Napovej brez računanja.
---
Iz dveh kosov, $(-\infty, 3] \cup [5, \infty)$: »vsaj $1$ stran od $4$« pomeni levo ali desno. Število $4$ ni v rešitvi, ker je $|4 - 4| = 0 < 1$. Krajišči $3$ in $5$ sta vključeni zaradi znaka $\ge$.
:::

## Rešeni primeri

### Primer 1 (lažji)

Izračunaj vrednost izraza $|{-3}| + |5 - 9| - |{-2}|$ in razdaljo med točkama $A(-4)$ in $B(3)$ na številski premici.

**Podatki:** izraz $|{-3}| + |5 - 9| - |{-2}|$, točki $A(-4)$ in $B(3)$ na številski premici
**Iščemo:** vrednost izraza in razdaljo $|AB|$

:::formula
$|x| = x$ za $x \ge 0$ in $|x| = -x$ za $x < 0$. Razdalja točk $A(a)$ in $B(b)$ je $|AB| = |b - a|$.
:::

**Rešitev:**

1. Število $-3$ je negativno, zato je $|{-3}| = 3$.
2. Najprej izračunamo vrednost znotraj absolutne vrednosti: $5 - 9 = -4$, torej $|5 - 9| = |{-4}| = 4$.
3. Podobno $|{-2}| = 2$.
4. Vrednost izraza: $3 + 4 - 2 = 5$.
5. Razdalja: $|AB| = |3 - (-4)| = |7| = 7$. Preverba v drugi smeri: $|{-4} - 3| = |{-7}| = 7$.
6. Odgovor: vrednost izraza je $5$, točki $A$ in $B$ sta oddaljeni za $7$ enot.

### Primer 2 (srednji)

Dana sta intervala $A = [-2, 4)$ in $B = (1, 6]$. Določi $A \cap B$, $A \cup B$ in $A \setminus B$ ter rezultate zapiši z intervali.

**Podatki:** $A = [-2, 4)$, $B = (1, 6]$
**Iščemo:** presek $A \cap B$, unijo $A \cup B$ in razliko $A \setminus B$

:::formula
$x \in A \cap B \iff x \in A \text{ in } x \in B$; $\;x \in A \cup B \iff x \in A \text{ ali } x \in B$; $\;x \in A \setminus B \iff x \in A \text{ in } x \notin B$
:::

**Rešitev:**

1. Z neenačbami: $A$ so števila z $-2 \le x < 4$, $B$ pa števila z $1 < x \le 6$.
2. **Presek:** hkrati morata veljati obe neenačbi. Večja leva meja je $1$ (izključena, ker $1 \notin B$), manjša desna meja je $4$ (izključena, ker $4 \notin A$). Torej $A \cap B = (1, 4)$.
3. **Unija:** najmanjši element je $-2$ (v $A$), največji je $6$ (v $B$). Intervala se prekrivata, zato vmes ni vrzeli. Torej $A \cup B = [-2, 6]$. Preverimo krajišči: $1 \in A$, $4 \in B$, zato ni luknje.
4. **Razlika:** iz $A$ odstranimo vse, kar je v $B$, to je števila z $x > 1$. Ostanejo števila z $-2 \le x \le 1$. Število $1$ ni v $B$, zato ostane: $A \setminus B = [-2, 1]$.
5. Preverba s števili: $x = 1$ je v $A$, ni v $B$, torej je v razliki. Število $x = 4$ je v $B$, ni v $A$, torej je v uniji, ne pa v preseku.
6. Odgovor: $A \cap B = (1, 4)$, $A \cup B = [-2, 6]$, $A \setminus B = [-2, 1]$.

### Primer 3 (težji)

Na izvidu piše, da je normalni srčni utrip odraslega v mirovanju od $60$ do $100$ utripov na minuto, obe meji vključno. (a) Zapiši območje kot interval. (b) Zapiši isti pogoj z absolutno vrednostjo v obliki $|x - c| \le r$. (c) Ali sta normalna utripa $58$ in $96$ utripov na minuto?

**Podatki:** spodnja meja $a = 60$ utripov na minuto, zgornja meja $b = 100$ utripov na minuto, obe meji vključeni; izmerjena utripa $58$ in $96$ utripov na minuto
**Iščemo:** interval, središče $c$ in polmer $r$ za pogoj $|x - c| \le r$ ter ali sta utripa normalna

:::formula
$c = \dfrac{a + b}{2}$, $\; r = \dfrac{b - a}{2}$ in $|x - c| \le r \iff x \in [c - r,\, c + r]$
:::

**Rešitev:**

1. »Obe meji vključno« pomeni $60 \le x \le 100$, zato sta oklepaja oglata: $x \in [60, 100]$.
2. Središče leži na sredini med mejama: $c = \dfrac{60 + 100}{2} = 80$.
3. Polmer je pol dolžine intervala, ker sega od središča enako daleč v obe smeri: $r = \dfrac{100 - 60}{2} = 20$.
4. Pogoj je $|x - 80| \le 20$. Preverba: $80 - 20 = 60$ in $80 + 20 = 100$, to sta ravno meji.
5. Zdaj ti: za oba utripa izračunaj odmik od $80$ in ga primerjaj z $20$.

:::premisli
Ali sta utripa $58$ in $96$ normalna?
---
$|58 - 80| = |-22| = 22 > 20$, zato utrip $58$ ni normalen (je prenizek). $|96 - 80| = 16 \le 20$, zato je utrip $96$ normalen. Isto pove interval: $58 < 60$, $96$ pa leži v $[60, 100]$. Odgovor: pogoj je $|x - 80| \le 20$, normalen je le utrip $96$ na minuto.
:::

## Pogoste napake

- **»Absolutna vrednost vsote je vsota absolutnih vrednosti«: $|a + b| = |a| + |b|$.** To velja le, če imata $a$ in $b$ isti predznak (ali je eno od njiju $0$). Za $a = 3$, $b = -5$ je $|3 + (-5)| = |{-2}| = 2$, medtem ko je $|3| + |{-5}| = 8$. Pravilno: najprej izračunaj vsoto, nato ji vzemi absolutno vrednost. Splošno velja le $|a + b| \le |a| + |b|$.
- **Odstranjevanje minusa po občutku: $|2 - 5| = 2 + 5 = 7$.** Absolutna vrednost ne spreminja znakov znotraj izraza. Pravilno: $2 - 5 = -3$, ta vrednost je negativna, zato jo zamenjaš z nasprotno: $|{-3}| = 3$.
- **Pomešani smeri pri neenačbah: rešitev $|x| > 3$ zapišeš kot $(-3, 3)$.** Razdalja od $0$ večja od $3$ pomeni **zunaj** tega odseka. Pravilno: $|x| < 3$ je $(-3, 3)$, $|x| > 3$ pa je $(-\infty, -3) \cup (3, \infty)$.
- **Napačni oklepaji: $[2, \infty]$ za $x \ge 2$ ali $(2, 5)$ za $2 \le x \le 5$.** Znak $\infty$ ni število, zato mu sledi okrogel oklepaj: $[2, \infty)$. Pri $\le$ in $\ge$ piši oglat oklepaj, pri $<$ in $>$ okrogel. Pravilno: $2 \le x \le 5$ je $[2, 5]$.
- **»Interval vsebuje le števila, ki jih vidiš«: $[3{,}5;\,5{,}1]$ beremo kot $3{,}5;\ 3{,}6;\ \dots;\ 5{,}1$.** Zapis z dvema krajiščema ni naštevanje. Interval vsebuje vsa realna števila med krajiščema, tudi $4{,}27$ ali $\sqrt{20}$. Pravilno: pri vsakem številu se vprašaj le, ali leži med krajiščema in ali je krajišče vključeno.

## Povzetek

- Realna števila: $\mathbb{R} = \mathbb{Q} \cup \mathbb{I}$. Iracionalna števila ($\sqrt{2}$, $\pi$) imajo neskončen neperiodičen decimalni zapis. Realna števila ustrezajo točkam na številski premici.
- Absolutna vrednost: $|x| = x$ za $x \ge 0$, $|x| = -x$ za $x < 0$. Pomeni razdaljo od $0$, razdalja med $a$ in $b$ je $|a - b|$.
- Lastnosti: $|{-x}| = |x|$, $|ab| = |a||b|$, $|a + b| \le |a| + |b|$. Enačba $|x| = a$ ima za $a > 0$ rešitvi $\pm a$, za $a = 0$ le $x = 0$, za $a < 0$ je brez rešitve.
- Intervali: $(a, b)$, $[a, b]$, $[a, b)$, $(a, b]$ in neomejeni. Okrogel oklepaj: krajišče ni vključeno. Oglat: je vključeno. Ob $\infty$ vedno okrogel.
- Presek, unija in razlika intervalov: nariši na isto premico in preveri krajišča.
- $|x - c| < r \iff x \in (c - r,\, c + r)$ (med). $|x - c| > r \iff x \in (-\infty,\, c - r) \cup (c + r,\, \infty)$ (zunaj).

## Drugače: Kot zgodba

Medicinska sestra Nina dela nočno izmeno. Zdravnik ji je naročil: »Pokliči me, če se temperatura bolnika od $37\,°\text{C}$ razlikuje za več kot $0{,}5\,°\text{C}$.« Nina si navodilo zapiše po svoje: kliči, če je $|t - 37| > 0{,}5$.

Ob polnoči ima gospod Kovač $38{,}2\,°\text{C}$, gospa Novak pa $35{,}8\,°\text{C}$. Ena vrednost je nad $37$, druga pod njo, a Nina izračuna $|38{,}2 - 37| = 1{,}2$ in $|35{,}8 - 37| = 1{,}2$. Oba sta enako daleč od $37$, zato pokliče za oba. Smer ni pomembna, šteje le razdalja.

Ob dveh ima gospod Kovač $37{,}3\,°\text{C}$. Odmik je $|37{,}3 - 37| = 0{,}3$, kar ni več kot $0{,}5$, zato ne kliče. Na rob kartona si nariše številsko premico. Mirne vrednosti so $|t - 37| \le 0{,}5$, torej interval $[36{,}5;\,37{,}5]$ s polnima krožcema. Klicati mora, ko je temperatura v enem od dveh kosov zunaj njega: $(-\infty;\,36{,}5) \cup (37{,}5;\,\infty)$.

## Drugače: Korak za korakom s številkami

Reši neenačbo $|2x - 1| < 5$ in rešitev zapiši z intervalom.

| Korak | Kaj naredimo | Rezultat |
|---|---|---|
| 1 | Pogoj »manj kot« pomeni, da je izraz $2x - 1$ med $-5$ in $5$. | $-5 < 2x - 1 < 5$ |
| 2 | Vsem trem delom prištejemo $1$. | $-4 < 2x < 6$ |
| 3 | Vse tri dele delimo z $2$ (pozitivno število, znaka se ne obrneta). | $-2 < x < 3$ |
| 4 | Zapišemo interval. | $x \in (-2, 3)$ |
| 5 | Preverba v sredini: $x = 0$ da $\lvert{-1}\rvert = 1 < 5$. | velja |
| 6 | Preverba na krajiščih: $x = 3$ da $\lvert 5 \rvert = 5$, $x = -2$ da $\lvert{-5}\rvert = 5$. | ne velja, krajišči izključeni |
| 7 | Preverba zunaj: $x = 4$ da $\lvert 7 \rvert = 7$. | ne velja |

Še en primer s pogojem »več ali enako«: $|x + 1| \ge 2$. Izraz $x + 1$ mora biti $\le -2$ ali $\ge 2$. Prvi primer da $x \le -3$, drugi $x \ge 1$. Rešitev: $(-\infty, -3] \cup [1, \infty)$. Preverba: $x = -3$ da $|{-2}| = 2 \ge 2$, $x = 1$ da $|2| = 2 \ge 2$, $x = 0$ da $|1| = 1 < 2$, torej pogoj ne velja, in $0$ res ni v rešitvi.

## Preveri se

? Referenčno območje za kalij v krvi je $[3{,}5;\,5{,}1]\,\text{mmol/L}$. Kaj pove ta zapis?
- Normalne so le vrednosti z eno decimalko: $3{,}5;\ 3{,}6;\ \dots;\ 5{,}1$.
~ Interval ni naštevanje. Vsebuje vsa realna števila med krajiščema, tudi $4{,}27$.
- Normalne so vrednosti med $3{,}5$ in $5{,}1$, krajišči pa nista vključeni.
~ To bi bil zapis $(3{,}5;\,5{,}1)$ z okroglima oklepajema. Oglati oklepaj krajišče vključi.
+ Normalne so vse vrednosti od $3{,}5$ do $5{,}1$, obe meji vključno.
> Interval $[a, b]$ je množica vseh realnih $x$ z $a \le x \le b$. Oglata oklepaja povesta, da sta tudi $3{,}5$ in $5{,}1$ normalni vrednosti.

? Razvrsti od najmanjšega do največjega: $p = |-7|$, $q = |3 - 5|$, $u = -|4|$, $v = |0|$.
- $v < q < u < p$
~ Tu je $u$ vzet kot $4$. Minus stoji zunaj absolutne vrednosti, zato je $u = -|4| = -4$.
- $u < v < p < q$
~ Tu je $|3 - 5|$ izračunano kot $3 + 5 = 8$. Najprej izračunaj $3 - 5 = -2$, nato $|-2| = 2$.
+ $u < v < q < p$
> Vrednosti so $p = 7$, $q = 2$, $u = -4$ in $v = 0$. Le $u$ je negativen, ker minus stoji pred absolutno vrednostjo.

? Rešitev neenačbe $|x - 1| < 2$ je $(-1, 3)$. Kaj se zgodi z rešitvijo, če znak $<$ zamenjamo z $\ge$?
- Postane $[-1, 3]$.
~ Spremenil si le oklepaja. Znak $\ge$ pomeni »vsaj $2$ stran od $1$«, to pa je zunaj, ne med.
- Postane $(-\infty, -1) \cup (3, \infty)$.
~ Smer je prava, a krajišči $-1$ in $3$ sta oddaljeni natanko $2$, zato ju znak $\ge$ vključi.
- Postane $[3, \infty)$.
~ Pozabil si na levo stran. Tudi $-5$ je od $1$ oddaljeno več kot $2$.
+ Postane $(-\infty, -1] \cup [3, \infty)$.
> Nova rešitev so vsa števila, ki jih stara ni vsebovala: dva kosa zunaj, s krajiščema, ker sta oddaljeni natanko $2$.

? Kolikšna je vrednost izraza $|3 - 8| - |{-2}|$?
- $7$
~ Absolutni vrednosti si seštel. Med njima je minus: $5 - 2$.
+ $3$
- $-7$
~ Prvo absolutno vrednost si izpustil: $-5 - 2$. Najprej $|3 - 8| = |-5| = 5$.
- $-3$
~ Obe absolutni vrednosti si izpustil: $-5 - (-2)$. Absolutna vrednost ni nikoli negativna.
> Najprej $3 - 8 = -5$, torej $|{-5}| = 5$. Nato $|{-2}| = 2$. Rezultat je $5 - 2 = 3$.

? Tableta mora vsebovati zdravilno učinkovino z maso $m$, za katero velja $|m - 250| \le 15$ (v mg). Katera tableta NE ustreza?
- $265\,\text{mg}$
~ Odmik je $|265 - 250| = 15$, kar je dovoljeno, saj znak $\le$ krajišče vključi.
- $236\,\text{mg}$
~ Razlika $236 - 250 = -14$ je negativna, a šteje razdalja: $|-14| = 14 \le 15$.
+ $234\,\text{mg}$
- $250\,\text{mg}$
~ To je središče intervala z odmikom $0$, zato zagotovo ustreza.
> Dovoljene mase so $[235, 265]\,\text{mg}$. Pri $234\,\text{mg}$ je odmik $|234 - 250| = 16 > 15$, zato tableta ne ustreza.

:::simboli
x | realno število (v primeru 3 srčni utrip) | | |
A, B | intervala (množici realnih števil) | | | v primeru 1 točki na številski premici
a, b | krajišči intervala ali abscisi točk $A$ in $B$ | | | razdalja točk je $\lvert b - a \rvert$; v enačbi $\lvert x \rvert = a$ je $a$ dano število
c | središče, od katerega merimo razdaljo | c = \frac{a + b}{2} | |
r | polmer: največja razdalja od $c$ | r = \frac{b - a}{2} | | $r > 0$
:::
