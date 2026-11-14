---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

*(višja raven) Iracionalne enačbe matura preverja samo na višji ravni. Izjema je razdelek 7 o enačbah $x^n = a$, ki je snov obeh ravni.*

Vzemi napačno trditev $-3 = 3$ in kvadriraj obe strani. Dobiš $(-3)^2 = 3^2$, torej $9 = 9$, kar je res. Kvadriranje je laž spremenilo v resnico. Sliši se kot trik, a prav ta pojav čaka pri vsaki enačbi s korenom.

Zdravnik za odmerek nekaterih zdravil potrebuje **telesno površino** bolnika. Oceni jo z Mostellerjevo formulo

$$S = \sqrt{\frac{h \cdot m}{3600}}$$

Tu je $h$ višina v centimetrih, $m$ masa v kilogramih, $S$ pa površina v $\mathrm{m^2}$. Pri kateri masi ima bolnik, visok $180\,\mathrm{cm}$, površino $1{,}8\,\mathrm{m^2}$? Neznanka je pod korenom. Koren odstraniš s kvadriranjem, pri tem pa se lahko prikradejo »rešitve«, ki to niso. Spoznal boš, kako jih ujameš in zakaj sploh nastanejo.

## Razlaga

**1. Ena enačba do konca.** Enačba, v kateri neznanka stoji pod korenom, je **iracionalna enačba**. Primer: $\sqrt{x + 6} = x$. Koren je že sam na levi strani. Obe strani kvadriramo, ker velja $\left(\sqrt{a}\right)^2 = a$ za $a \ge 0$.

Dobimo enačbo brez korena: $x + 6 = x^2$, urejeno $x^2 - x - 6 = 0$. Tričlen razstavimo po Vietovem pravilu: števili z zmnožkom $-6$ in vsoto $-1$ sta $-3$ in $2$. Enačba se glasi $(x - 3)(x + 2) = 0$. Produkt je nič, ko je nič kateri od faktorjev: $x = 3$ ali $x = -2$.

**2. Preizkus.** Obe števili vstavimo v *prvotno* enačbo:

| $x$ | levo: $\sqrt{x+6}$ | desno | velja? |
|---|---|---|---|
| $3$ | $\sqrt{9} = 3$ | $3$ | da |
| $-2$ | $\sqrt{4} = 2$ | $-2$ | ne |

Število, ki ga dobimo med računanjem, a prvotne enačbe ne reši, je **navidezna rešitev**. Enačba $\sqrt{x + 6} = x$ ima eno samo rešitev, $x = 3$.

:::premisli
Število $x = -2$ izpolni pogoj $x + 6 \ge 0$, koren torej obstaja. Kateri drug pogoj bi ga izločil že pred preizkusom, brez vstavljanja?
---
Pogoj $x \ge 0$ za desno stran. Kvadratni koren je vedno nenegativen: $\sqrt{4} = 2$. Desna stran pa je pri $x = -2$ negativna. Nenegativno število ne more biti enako negativnemu, zato mora biti nenegativna tudi desna stran.
:::

**3. Kaj vidimo na grafu.** Levo stran enačbe preberemo kot funkcijo $y = \sqrt{x + 6}$, desno kot premico $y = x$. Rešitve enačbe so abscise presečišč.

:::risba graf
opis: Polna modra krivulja je graf y = √(x + 6), začne se v točki (−6, 0) in narašča. Črtkana siva krivulja je njena zrcalna slika y = −√(x + 6). Oranžna premica je y = x. Polna krivulja seka premico samo v točki (3, 3). Črtkana krivulja seka premico v točki (−2, −2).
x: -7 .. 5 | 1 | x
y: -5 .. 5 | 1 | y
enako: da
f: sqrt(x+6) | modra | -6 .. 5
f: -sqrt(x+6) | siva črtkano | -6 .. 5
f: x | oranžna | -5 .. 5
točka: 3; 3 | (3, 3) | nad levo | modra
točka: -2; -2 | (−2, −2) | desno | siva
napis: -4; 2 | y = √(x + 6) | nad | modra
napis: -4; -2 | y = −√(x + 6) | pod | siva
napis: -4,5; -4,5 | y = x | desno | oranžna
podnapis: Polna krivulja da pravo rešitev, črtkana navidezno.
:::

Polna krivulja in premica se sekata le v $(3, 3)$. Od kod torej $-2$? Enačba $x + 6 = x^2$ ne loči med $\sqrt{x + 6}$ in $-\sqrt{x + 6}$, saj imata isti kvadrat. Po kvadriranju zato iščemo presečišča premice z **obema** krivuljama. Črtkana jo seka v $(-2, -2)$: to je navidezna rešitev.

**4. Zakaj kvadriranje ni varen korak.** Iz $a = b$ vedno sledi $a^2 = b^2$. Obratno ne velja: iz $a^2 = b^2$ sledi le, da je $a = b$ *ali* $a = -b$. Prav to se je zgodilo pri $-3$ in $3$ na začetku. Kvadriranje rešitve lahko doda, izgubi pa jih ne. Pravimo, da kvadriranje ni **ekvivalentno preoblikovanje**: ne ohrani množice rešitev. Zato je preizkus pri iracionalni enačbi del rešitve, ne olepšava.

**5. Postopek v splošnem.** Enačbo zapišemo v obliki $\sqrt{A} = B$, kjer sta $A$ in $B$ izraza z $x$.

1. Koren **osamimo**: na eni strani je samo koren.
2. Zapišemo **pogoja**: $A \ge 0$ (koren obstaja) in $B \ge 0$ (koren je nenegativen).
3. Obe strani kvadriramo: dobimo enačbo $A = B^2$.
4. Rešimo enačbo brez korena.
5. Vsakega kandidata preverimo s pogoji ali s **preizkusom** v prvotni enačbi.

**6. Dva korena.** Če sta v enačbi dva korena, najprej osamimo enega in kvadriramo. Ostane en koren; tega osamimo in kvadriramo še enkrat. Pri prvem kvadriranju je na drugi strani vsota, zato potrebujemo obrazec $(p + q)^2 = p^2 + 2pq + q^2$.

:::premisli
Kaj dobiš, če enačbo $\sqrt{x} + 1 = 3$ kvadriraš takoj, brez osamitve? Napovej, ali koren izgine.
---
Ne izgine. Leva stran je vsota: $(\sqrt{x} + 1)^2 = x + 2\sqrt{x} + 1$. Dvojni zmnožek $2\sqrt{x}$ še vedno vsebuje koren. Če pa najprej osamiš $\sqrt{x} = 2$, po kvadriranju takoj dobiš $x = 4$.
:::

**7. Enačbe $x^n = a$ (osnovna in višja raven).** Ta del matura preverja na obeh ravneh. Preprosto enačbo s potenco rešimo na dva načina.

- **S korenjenjem.** Pri lihem $n$ ima enačba eno rešitev, $x = \sqrt[n]{a}$, tudi za negativen $a$: enačba $x^3 = 8$ da $x = \sqrt[3]{8} = 2$, enačba $x^3 = -27$ da $x = -3$. Pri sodem $n$ in $a > 0$ sta rešitvi dve, $x = \pm\sqrt[n]{a}$: enačba $x^4 = 16$ da $x = 2$ ali $x = -2$. Pri sodem $n$ in $a < 0$ realne rešitve ni.
- **Z razstavljanjem.** Vse prenesemo na levo in razstavimo. Za razliko kubov velja $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$ (preveriš z množenjem). Enačba $x^3 - 8 = 0$ postane $(x - 2)(x^2 + 2x + 4) = 0$. Drugi faktor dopolnimo do popolnega kvadrata: $x^2 + 2x + 4 = (x + 1)^2 + 3 \ge 3$, zato ni nikoli nič, zato je $x = 2$ edina rešitev. Enačba $x^4 - 16 = 0$ postane $(x^2 - 4)(x^2 + 4) = 0$, po še eni razliki kvadratov $(x - 2)(x + 2)(x^2 + 4) = 0$, kar da $x = 2$ in $x = -2$.

Oba načina dasta iste rešitve. Razstavljanje pokaže, *zakaj* ima soda potenca dve rešitvi: razlika kvadratov da faktorja $x - 2$ in $x + 2$.

## Rešeni primeri

### Primer 1 (lažji): najprej osami koren

Reši enačbo $x - \sqrt{x + 1} = 5$.

**Podatki:** enačba $x - \sqrt{x + 1} = 5$
**Iščemo:** vse realne rešitve $x$

:::formula
Enačba $\sqrt{A} = B$: pogoja $A \ge 0$ in $B \ge 0$, nato kvadriramo v $A = B^2$.
:::

**Rešitev:**

1. Koren osamimo, da ga kvadriranje odstrani: enačba se glasi $\sqrt{x + 1} = x - 5$.
2. Pogoja: $x + 1 \ge 0$ in $x - 5 \ge 0$. Skupaj velja $x \ge 5$.
3. Kvadriramo, desno po obrazcu za kvadrat razlike: enačba $x + 1 = x^2 - 10x + 25$.
4. Uredimo v enačbo $x^2 - 11x + 24 = 0$ in razstavimo: $(x - 3)(x - 8) = 0$, torej $x = 3$ ali $x = 8$.
5. Število $3$ ne izpolni pogoja $x \ge 5$, zato odpade. Preizkus za $8$: $8 - \sqrt{9} = 5$, ustreza.
6. Odgovor: enačba ima eno rešitev, $x = 8$.

### Primer 2: dva korena, dvakrat kvadriramo

Reši enačbo $\sqrt{3x + 1} - \sqrt{x + 4} = 1$.

**Podatki:** enačba $\sqrt{3x + 1} - \sqrt{x + 4} = 1$
**Iščemo:** vse realne rešitve $x$

:::formula
$(p + q)^2 = p^2 + 2pq + q^2$ in $\left(\sqrt{A}\right)^2 = A$ za $A \ge 0$
:::

**Rešitev:**

1. Oba korena morata obstajati: $3x + 1 \ge 0$ in $x + 4 \ge 0$, torej $x \ge -\dfrac{1}{3}$.
2. Osamimo prvi koren, da bo na levi sam: enačba $\sqrt{3x + 1} = 1 + \sqrt{x + 4}$. Desna stran je pozitivna, nov pogoj ne nastane.
3. Kvadriramo; desno je vsota, zato dobimo dvojni zmnožek: enačba $3x + 1 = 1 + 2\sqrt{x + 4} + x + 4$.
4. Uredimo v $2x - 4 = 2\sqrt{x + 4}$ in delimo z $2$, da drugi koren ostane sam: enačba $x - 2 = \sqrt{x + 4}$. Nov pogoj: $x - 2 \ge 0$, torej $x \ge 2$.
5. Kvadriramo še enkrat: enačba $x^2 - 4x + 4 = x + 4$, urejeno $x^2 - 5x = 0$, razstavljeno $x(x - 5) = 0$. Kandidata sta $x = 0$ in $x = 5$.
6. Število $0$ ne izpolni pogoja $x \ge 2$. Preizkus za $0$ to potrdi: $\sqrt{1} - \sqrt{4} = -1$, ne $1$. Preizkus za $5$: $\sqrt{16} - \sqrt{9} = 1$, ustreza.
7. Odgovor: rešitev je $x = 5$.

### Primer 3 (težji): telesna površina bolnika

Bolnik je visok $180\,\mathrm{cm}$. a) Pri kateri masi bi bila njegova telesna površina po Mostellerjevi formuli $1{,}8\,\mathrm{m^2}$? b) Drug bolnik iste višine ima za $10\,\%$ večjo površino. Za koliko odstotkov je večja njegova masa?

**Podatki:** $h = 180\,\mathrm{cm}$, $S_1 = 1{,}8\,\mathrm{m^2}$, $S_2$ je za $10\,\%$ večja od $S_1$
**Iščemo:** maso $m_1$, maso $m_2$ in za koliko odstotkov je $m_2$ večja od $m_1$

:::formula
$S = \sqrt{\dfrac{h \cdot m}{3600}}$, po kvadriranju $m = \dfrac{3600\,S^2}{h}$
:::

**Rešitev:**

1. Pogoja: desna stran $1{,}8$ je pozitivna, korenjenec je pozitiven za vsako maso $m > 0$.
2. Kvadriramo, da se znebimo korena: $\dfrac{180 \cdot m_1}{3600} = 1{,}8^2$, torej $\dfrac{m_1}{20} = 3{,}24$.
3. Zato je $m_1 = 20 \cdot 3{,}24 = 64{,}8\,\mathrm{kg}$. Preizkus: $\dfrac{180 \cdot 64{,}8}{3600} = 3{,}24$ in $\sqrt{3{,}24} = 1{,}8$, ustreza.
4. Druga površina: $S_2 = 1{,}1 \cdot 1{,}8 = 1{,}98\,\mathrm{m^2}$. Enako kot prej je $m_2 = 20 \cdot 1{,}98^2 = 78{,}408\,\mathrm{kg}$, kar je približno $78{,}4\,\mathrm{kg}$.
5. Razmerje mas: ker je $m = 20\,S^2$, je $\dfrac{m_2}{m_1} = \left(\dfrac{S_2}{S_1}\right)^2 = 1{,}1^2 = 1{,}21$. Masa je večja za $21\,\%$, površina le za $10\,\%$.
6. Razlaga rezultata: masa je pod korenom, zato se ob povečanju površine poveča s kvadratom faktorja. Kvadrat negativne površine $-1{,}8$ bi dal isto maso, a negativne površine ni. Pogoj $S \ge 0$ tak »odgovor« izključi.
7. Odgovor: bolnik bi imel maso $64{,}8\,\mathrm{kg}$; pri površini $1{,}98\,\mathrm{m^2}$ je masa okoli $78{,}4\,\mathrm{kg}$, kar je $21\,\%$ več.

### Primer 4 – zdaj ti

Reši enačbo $\sqrt{5 - x} = x + 1$.

**Podatki:** enačba $\sqrt{5 - x} = x + 1$
**Iščemo:** vse realne rešitve $x$

:::formula
Enačba $\sqrt{A} = B$: pogoja $A \ge 0$ in $B \ge 0$, nato kvadriramo v $A = B^2$.
:::

**Rešitev:**

1. Koren je že osamljen. Pogoja: $5 - x \ge 0$ in $x + 1 \ge 0$, torej $-1 \le x \le 5$.
2. Kvadriramo: enačba $5 - x = x^2 + 2x + 1$, urejeno $x^2 + 3x - 4 = 0$.
3. Razstavimo: $(x + 4)(x - 1) = 0$. Kandidata sta $x = -4$ in $x = 1$.
4. Zdaj ti: kateri kandidat je rešitev? Utemelji s pogoji in s preizkusom.

:::premisli
Kateri kandidat ostane?
---
Ostane $x = 1$. Preizkus: $\sqrt{4} = 2$ in $1 + 1 = 2$. Kandidat $x = -4$ ne izpolni pogoja $x \ge -1$: leva stran bi bila $\sqrt{9} = 3$, desna $-3$. To je navidezna rešitev.
:::

## Pogoste napake

- **Kvadriranje po členih.** Iz $\sqrt{x + 1} + 2 = x$ učenec napiše $x + 1 + 4 = x^2$ (napačno). Vsote ne kvadriraš člen za členom, ker manjka dvojni zmnožek. Najprej osami koren, $\sqrt{x + 1} = x - 2$, šele nato kvadriraj. Enako pri drugem kvadriranju: $\left(1 + \sqrt{x + 4}\right)^2$ ima člen $2\sqrt{x + 4}$.
- **Brez preizkusa.** »Enačbo sem rešil, rešitvi sta $3$ in $-2$.« Kvadriranje doda kandidate, zato za $\sqrt{x + 6} = x$ ostane le $3$. Vsakega kandidata preveri v prvotni enačbi ali s pogoji.
- **Preveriš le, ali koren obstaja.** Pogoj $A \ge 0$ ni dovolj: pri $x = -2$ je $x + 6 = 4 \ge 0$, pa $-2$ vseeno ni rešitev. Koren je nenegativen, zato mora biti nenegativna tudi druga stran, $B \ge 0$.
- **Pozabljen $\pm$ ali napačen predznak pri $x^n = a$.** Enačba $x^4 = 16$ nima samo rešitve $2$, ampak tudi $-2$. Obratno ima $x^3 = -27$ rešitev $-3$: lihi koren negativnega števila obstaja.

## Povzetek

- Iracionalna enačba ima neznanko pod korenom. Rešujemo jo tako, da koren osamimo in obe strani kvadriramo.
- Pogoja za $\sqrt{A} = B$: $A \ge 0$ in $B \ge 0$, saj je koren nenegativen.
- Kvadriranje ni ekvivalentno preoblikovanje: iz $a^2 = b^2$ sledi $a = b$ ali $a = -b$. Lahko doda navidezne rešitve, zato je preizkus v prvotni enačbi obvezen.
- Na grafu: navidezna rešitev je presečišče z zrcalno krivuljo $y = -\sqrt{A}$.
- Dva korena: osami enega, kvadriraj, osami drugega, kvadriraj še enkrat; pazi na dvojni zmnožek.
- Enačba $x^n = a$: pri lihem $n$ je $x = \sqrt[n]{a}$; pri sodem $n$ in $a > 0$ je $x = \pm\sqrt[n]{a}$; pri sodem $n$ in $a < 0$ ni realne rešitve. Isto dobiš z razstavljanjem.
- Pri nalogi z besedilom rezultat razloži: kandidat, ki nima smisla (negativna površina), odpade.

## Drugače: Z analogijo

Pomisli na **presejalni test** v zdravstvu. Test ujame vse bolne, a ob njih včasih označi tudi zdrave (lažno pozitivni). Zato vsak pozitiven izid preveri še potrditveni test.

Kvadriranje je presejalni test. Nobene prave rešitve ne izpusti, vrne pa lahko tudi navidezne. Preizkus v prvotni enačbi je potrditveni test: vsakega kandidata preveri posebej. Če bi potrditveni test izpustil, bi »zdravil« ljudi, ki niso bolni. Če izpustiš preizkus, zapišeš rešitev, ki enačbe ne reši.

Analogija ima mejo: presejalni test lahko kakšnega bolnika tudi zgreši. Kvadriranje prave rešitve ne izgubi nikoli, saj iz $a = b$ vedno sledi $a^2 = b^2$.

## Drugače: Bolj natančno

Enačba $\sqrt{A} = B$ je **ekvivalentna** sistemu »$A = B^2$ in $B \ge 0$«. Pogoj $A \ge 0$ je tedaj že izpolnjen, ker je $A = B^2 \ge 0$. Zato pri preverjanju odloča predvsem predznak druge strani.

Pri lihem korenu je drugače. Funkcija $x \mapsto x^3$ je naraščajoča, zato iz $a^3 = b^3$ sledi $a = b$. Kubiranje *je* ekvivalentno preoblikovanje in navideznih rešitev ne prinese. Primer: enačba $\sqrt[3]{x - 1} = -2$ po kubiranju da $x - 1 = -8$, torej $x = -7$. Preizkus: $\sqrt[3]{-8} = -2$.

Korene lahko zapišeš tudi s potencami: enačba $(x + 6)^{\frac{1}{2}} = x$ je enaka enačbi iz razlage in ima isto rešitev $x = 3$. Potenca z racionalnim eksponentom je definirana le za nenegativno osnovo, zato ostanejo isti pogoji.

## Preveri se

? Medicinska sestra je za tri bolnike zapisala enačbe z neznano maso $m$. Katera od njih je iracionalna enačba?
- $\sqrt{2} \cdot m = 90$
~ Koren je le pri številu $2$, ki je koeficient. Neznanka $m$ ni pod korenom, zato je to linearna enačba.
- $m^2 = 4900$
~ To enačbo rešiš s korenjenjem, a neznanka ni pod korenom. Iracionalna je enačba, v kateri je neznanka pod korenom.
+ $\sqrt{\dfrac{170 \cdot m}{3600}} = 1{,}9$
- $m = \sqrt{5000}$
~ Koren je le v vrednosti rešitve. Rešitev je iracionalno število, enačba pa ni iracionalna, ker $m$ ni pod korenom.
> Iracionalna enačba ima neznanko pod korenom. To velja samo za Mostellerjevo enačbo.

? Razvrsti korake reševanja enačbe s korenom po vrstnem redu.
1. Koren osamiš na eni strani enačbe.
2. Zapišeš pogoja: korenjenec in druga stran sta nenegativna.
3. Obe strani kvadriraš.
4. Rešiš dobljeno enačbo brez korena.
5. Kandidate preveriš s pogoji in preizkusom v prvotni enačbi.
> Brez osamitve se koren s kvadriranjem ne odstrani. Preizkus je na koncu, ker kvadriranje lahko doda navidezne rešitve.

? Kaj se zgodi, če enačbo $\sqrt{x + 2} = x$ samo kvadriraš in rešiš, brez preizkusa? Pomagaj si s sliko.
:::risba graf
opis: Polna modra krivulja je graf y = √(x + 2), črtkana siva je y = −√(x + 2), oranžna premica je y = x. Polna krivulja seka premico v točki (2, 2), črtkana v točki (−1, −1).
x: -3 .. 4 | 1 | x
y: -3 .. 4 | 1 | y
enako: da
f: sqrt(x+2) | modra | -2 .. 4
f: -sqrt(x+2) | siva črtkano | -2 .. 4
f: x | oranžna | -3 .. 4
točka: 2; 2 | (2, 2) | nad levo | modra
točka: -1; -1 | (−1, −1) | desno | siva
:::
+ Dobiš $x = 2$ in $x = -1$; število $-1$ je navidezna rešitev s črtkane krivulje.
- Dobiš samo $x = 2$, ker kvadriranje ne doda ničesar.
~ Kvadriranje ne loči $\sqrt{x + 2}$ od $-\sqrt{x + 2}$, zato dobiš tudi presečišče premice s črtkano krivuljo.
- Dobiš $x = 2$ in $x = -1$; obe sta rešitvi, ker je pri obeh $x + 2 \ge 0$.
~ Korenjenec je res nenegativen, a pri $x = -1$ je desna stran negativna: $\sqrt{1} = 1$, ne $-1$.
- Izgubiš rešitev $x = 2$.
~ Kvadriranje rešitev ne izgubi, lahko jih le doda. Iz $2 = 2$ sledi $4 = 4$.
> Po kvadriranju dobiš enačbo $x + 2 = x^2$ s kandidatoma $2$ in $-1$. Na sliki je $-1$ presečišče s črtkano krivuljo, zato ga preizkus izloči.

? (brez računala) Reši enačbo $\sqrt{2x + 7} = x + 2$. Vpiši rešitev.
= 1
~ -3 | Število $-3$ je navidezna rešitev: desna stran je $-1$, koren pa $\sqrt{1} = 1$. Naredi preizkus ali preveri pogoj $x + 2 \ge 0$.
> Kvadriranje da enačbo $x^2 + 2x - 3 = 0$, razstavljeno $(x + 3)(x - 1) = 0$. Pogoj $x \ge -2$ izloči $-3$. Preizkus za $1$: $\sqrt{9} = 3 = 1 + 2$.

? Bolnica je visoka $160\,\mathrm{cm}$, njena telesna površina po Mostellerjevi formuli $S = \sqrt{\dfrac{h \cdot m}{3600}}$ je $1{,}6\,\mathrm{m^2}$. Kolikšna je njena masa v kilogramih?
= 57,6 kg | 0,1
~ 36 | Pozabil si kvadrirati površino: kvadriraš obe strani, zato je na desni $1{,}6^2 = 2{,}56$, ne $1{,}6$.
~ 28,5 | Površino si korenil namesto kvadriral. Koren odstraniš s kvadriranjem.
> Kvadriramo: $\dfrac{160 \cdot m}{3600} = 2{,}56$, zato je $m = \dfrac{3600 \cdot 2{,}56}{160} = 57{,}6\,\mathrm{kg}$.

:::simboli
S | telesna površina | S = \sqrt{\dfrac{h \cdot m}{3600}} | m^2 | Mostellerjeva ocena
S_1, S_2 | površini prvega in drugega bolnika | | m^2
h | telesna višina | | cm
m | telesna masa | m = \dfrac{3600\,S^2}{h} | kg
m_1, m_2 | masi prvega in drugega bolnika | | kg
x | neznanka | | |
A | korenjenec (izraz pod korenom) | | | pogoj $A \ge 0$
B | izraz na drugi strani enačbe | | | pogoj $B \ge 0$
p, q | člena vsote, ki jo kvadriramo | | |
n | eksponent v enačbi $x^n = a$ | | | naravno število
a | desna stran enačbe $x^n = a$ | | |
:::

<<RACUN
resi: sqrt(x+6)=x | x | 3
resi: x^2-x-6=0 | x | -2, 3
resi: x-sqrt(x+1)=5 | x | 8
resi: sqrt(3*x+1)-sqrt(x+4)=1 | x | 5
resi: x-2=sqrt(x+4) | x | 5
resi: sqrt(180*m/3600)=1.8 | m | 64.8
resi: sqrt(180*m/3600)=1.98 | m | 78.408
vrednost: 1.1^2 | 1.21
resi: sqrt(5-x)=x+1 | x | 1
resi: x^3=8 | x | 2
resi: x^4=16 | x | -2, 2
enako: (x-2)*(x^2+2*x+4) | x^3-8
resi: sqrt(x+2)=x | x | 2
resi: sqrt(2*x+7)=x+2 | x | 1
resi: sqrt(160*m/3600)=1.6 | m | 57.6
resi: x-1=(-2)^3 | x | -7
>>
