---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

*(višja raven) Krožne funkcije matura preverja samo na višji ravni.*

Antični astronomi, med njimi Ptolemaj, so sestavljali tabele tetiv. Za vsak kot so zapisali dolžino tetive v krogu, kar je današnji sinus v drugačni preobleki. Pri opazovanju neba pa so pogosto potrebovali obratno pot: izmerili so razmerje in iskali kot, ki mu pripada. Tabelo so takrat brali v nasprotni smeri, od vrednosti proti kotu.

Isto vprašanje postavi zvok. Membrana zvočnika pri čistem tonu niha po zakonu $y = A\sin(2\pi f t)$. Kdaj prvič doseže polovico največjega odmika? Vrednost sinusa poznamo, to je $\frac12$. Iščemo kot in iz njega čas.

Kalkulator ima za to tipko $\sin^{-1}$. Ta tipka je ena od **krožnih funkcij**. Ime »arkus« pomeni lok: iščemo lok na enotski krožnici, ki ima dani sinus, kosinus ali tangens.

## Razlaga

**1. Mamljiva napaka: $\sin^{-1}$ ni ulomek.** Oznaka $^{-1}$ spominja na potenco, zato se zdi, da $\sin^{-1} x$ pomeni $\frac{1}{\sin x}$. Preizkus pokaže drugače. Tipka $\sin^{-1}$ pri vrednosti $0{,}5$ vrne $0{,}5236$, kar je $\frac{\pi}{6}$: kot, katerega sinus je $0{,}5$. Ulomek bi pri tem kotu dal nekaj povsem drugega, $\frac{1}{\sin\frac{\pi}{6}} = 2$.

Oznaka $^{-1}$ tu pomeni **obratno (inverzno) funkcijo**. Sinus kotu priredi število, obratna funkcija pa številu priredi kot. Da ne pride do zmede, pišemo $\arcsin x$ (beri »arkus sinus«).

**2. Druga napaka: en sinus, en kot.** Premica $y = \frac12$ seka graf sinusa v neskončno točkah: pri $\frac{\pi}{6}$, $\frac{5\pi}{6}$, $\frac{13\pi}{6}$ in tako naprej. Funkcija pa mora vsakemu številu prirediti en sam rezultat. Zato sinus **zožimo** na interval, kjer vsako vrednost od $-1$ do $1$ doseže natanko enkrat. To je $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$, kjer sinus narašča.

V simulaciji spodaj »Kot iz vrednosti sinusa« nastavi $a = 0{,}5$. Na $[0, 2\pi)$ dobiš dve rešitvi, $\frac{\pi}{6}$ in $\frac{5\pi}{6}$; v zoženem intervalu leži le prva. Nato nastavi $a = -0{,}5$. Opazi, da nobena prikazana rešitev ni med $-\frac{\pi}{2}$ in $\frac{\pi}{2}$: arkus sinus vrne $-\frac{\pi}{6}$, kar je kot $\frac{11\pi}{6}$, zmanjšan za $2\pi$.

**3. Arkus sinus.** $\arcsin x$ je tisti kot $y$ z intervala $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$, za katerega je $\sin y = x$. Primer: $\arcsin\frac12 = \frac{\pi}{6}$, ker je $\sin\frac{\pi}{6} = \frac12$ in $\frac{\pi}{6}$ leži v intervalu.

Graf dobimo z zrcaljenjem. Del sinusa na $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$ prezrcalimo čez premico $y = x$, saj obratna funkcija zamenja vlogi $x$ in $y$.

:::risba graf
opis: Polna debela krivulja je graf y = arcsin x od točke (−1; −π/2) do točke (1; π/2). Oranžna črtkana krivulja je sinus na intervalu od −π/2 do π/2, siva črtkana premica je y = x. Graf arkus sinusa je zrcalna slika črtkanega dela sinusa čez to premico. Označena je točka (1/2; π/6).
x: -2 .. 2 | 0,5 | x
y: -2 .. 2 | 0,5 | y
enako: da
oznake: ne
oznakax: -1 | −1
oznakax: 1 | 1
oznakay: 1,5708 | π/2
oznakay: -1,5708 | −π/2
f: x | siva črtkano
f: sin(x) | oranžna črtkano | -1,5708 .. 1,5708
f: arcsin(x) | modra debelo | -1 .. 1
točka: 1; 1,5708
točka: -1; -1,5708
točka: 0,5; 0,5236 | (1/2, π/6) | desno
:::

Z grafa preberemo lastnosti. **Definicijsko območje** je $[-1, 1]$, ker sinus drugih vrednosti nima. **Zaloga vrednosti** je $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$. Funkcija narašča in je liha: $\arcsin(-x) = -\arcsin x$ za $-1 \le x \le 1$. Zato je $\arcsin\left(-\frac12\right) = -\frac{\pi}{6}$.

:::premisli
Zakaj sinusa ne zožimo na $[0, \pi]$, saj je tudi tam lepo zvezen?
---
Na $[0, \pi]$ sinus vsako vrednost med $0$ in $1$ doseže dvakrat, na primer $\sin\frac{\pi}{6} = \sin\frac{5\pi}{6}$. Negativnih vrednosti tam sploh nima. Obratna funkcija ne bi bila enolična in ne bi bila definirana za negativna števila.
:::

**4. Arkus kosinus.** Pri kosinusu interval $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$ ne deluje, ker je $\cos\left(-\frac{\pi}{3}\right) = \cos\frac{\pi}{3}$. Vzamemo $[0, \pi]$, kjer kosinus pada od $1$ do $-1$. $\arccos x$ je kot z intervala $[0, \pi]$, katerega kosinus je $x$.

Definicijsko območje je $[-1, 1]$, zaloga vrednosti $[0, \pi]$. Funkcija pada in ni ne soda ne liha. Rezultat ni nikoli negativen: $\arccos\left(-\frac12\right) = \frac{2\pi}{3}$, ne $-\frac{\pi}{3}$. Velja zveza $\arccos(-x) = \pi - \arccos x$ za $-1 \le x \le 1$.

:::risba graf
opis: Graf y = arccos x od točke (−1; π) do točke (1; 0). Krivulja pada, os y seka v točki (0; π/2). Označena je točka (−1/2; 2π/3).
x: -1,5 .. 1,5 | 0,5 | x
y: -0,5 .. 3,5 | 0,5 | y
enako: da
oznake: ne
oznakax: -1 | −1
oznakax: 1 | 1
oznakay: 1,5708 | π/2
oznakay: 3,1416 | π
f: arccos(x) | modra debelo | -1 .. 1
točka: -1; 3,1416
točka: 0; 1,5708
točka: 1; 0
točka: -0,5; 2,0944 | (−1/2, 2π/3) | desno
:::

**5. Arkus tangens.** Tangens na odprtem intervalu $\left(-\frac{\pi}{2}, \frac{\pi}{2}\right)$ narašča in zavzame vsa realna števila. $\arctan x$ je kot s tega intervala, katerega tangens je $x$. Definicijsko območje je $\mathbb{R}$, zaloga vrednosti $\left(-\frac{\pi}{2}, \frac{\pi}{2}\right)$. Funkcija narašča in je liha. Na primer $\arctan 1 = \frac{\pi}{4}$ in $\arctan(-\sqrt3) = -\frac{\pi}{3}$.

:::premisli
Tangens ima navpični asimptoti $x = -\frac{\pi}{2}$ in $x = \frac{\pi}{2}$. Kakšni asimptoti napoveš za arkus tangens?
---
Vodoravni, $y = -\frac{\pi}{2}$ in $y = \frac{\pi}{2}$. Zrcaljenje čez $y = x$ navpično premico spremeni v vodoravno. Graf se jima približuje, doseže pa ju ne, ker $\tan\frac{\pi}{2}$ ne obstaja.
:::

:::risba graf
opis: Graf y = arctan x za x od −6 do 6. Krivulja narašča skozi izhodišče. Na desni se približuje sivi črtkani premici y = π/2, na levi premici y = −π/2, a ju ne doseže.
x: -6 .. 6 | 1 | x
y: -2 .. 2 | 0,5 | y
oznake: ne
oznakax: -4 | −4
oznakax: 4 | 4
oznakay: 1,5708 | π/2
oznakay: -1,5708 | −π/2
f: arctan(x) | modra debelo
črta: -6; 1,5708 -> 6; 1,5708 | siva črtkano
črta: -6; -1,5708 -> 6; -1,5708 | siva črtkano
:::

**6. Pregled.** Vse tri funkcije na enem mestu:

| | $\arcsin x$ | $\arccos x$ | $\arctan x$ |
|---|---|---|---|
| $D$ | $[-1, 1]$ | $[-1, 1]$ | $\mathbb{R}$ |
| $Z$ | $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$ | $[0, \pi]$ | $\left(-\frac{\pi}{2}, \frac{\pi}{2}\right)$ |
| potek | narašča | pada | narašča |
| simetrija | liha | nobena | liha |
| asimptoti | ni | ni | $y = \pm\frac{\pi}{2}$ |

**7. Past pri sestavljanju.** Če najprej vzameš arkus in nato sinus, dobiš vedno začetno število:

$$\sin(\arcsin x) = x \quad \text{za } -1 \le x \le 1$$

Obratni vrstni red pa vrne $x$ samo, če $x$ že leži v zalogi vrednosti arkus sinusa:

$$\arcsin(\sin x) = x \quad \text{samo za } -\frac{\pi}{2} \le x \le \frac{\pi}{2}$$

Zunaj tega intervala ni tako. Iz $\sin\frac{5\pi}{6} = \frac12$ sledi $\arcsin\left(\sin\frac{5\pi}{6}\right) = \arcsin\frac12 = \frac{\pi}{6}$. Podobno velja $\arctan\left(\tan\frac{3\pi}{4}\right) = \arctan(-1) = -\frac{\pi}{4}$ in $\arccos\left(\cos\left(-\frac{\pi}{3}\right)\right) = \frac{\pi}{3}$.

**8. Most k enačbam.** Pri enačbi $\sin x = a$ arkus sinus vrne le eno rešitev, $x_1 = \arcsin a$, tisto z intervala $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$. Vse druge dobiš iz znanih splošnih rešitev: $x = x_1 + 2k\pi$ ali $x = \pi - x_1 + 2k\pi$. Pri kosinusu je $x = \pm\arccos a + 2k\pi$, pri tangensu $x = \arctan a + k\pi$.

## Rešeni primeri

### Primer 1 (lažji): vrednosti brez računala

Brez računala izračunaj $\arcsin\frac{\sqrt3}{2}$, $\arccos\left(-\frac{\sqrt2}{2}\right)$ in $\arctan(-1)$.

**Podatki:** vrednosti $\frac{\sqrt3}{2}$, $-\frac{\sqrt2}{2}$ in $-1$; rezultat v radianih
**Iščemo:** kote $\arcsin\frac{\sqrt3}{2}$, $\arccos\left(-\frac{\sqrt2}{2}\right)$, $\arctan(-1)$

:::formula
Iščemo kot z dano vrednostjo funkcije, ki leži v zalogi vrednosti: $\arcsin$ v $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$, $\arccos$ v $[0, \pi]$, $\arctan$ v $\left(-\frac{\pi}{2}, \frac{\pi}{2}\right)$.
:::

**Rešitev:**

1. Velja $\sin\frac{\pi}{3} = \frac{\sqrt3}{2}$ in $\frac{\pi}{3}$ leži v $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$, zato je $\arcsin\frac{\sqrt3}{2} = \frac{\pi}{3}$.
2. Velja $\cos\frac{\pi}{4} = \frac{\sqrt2}{2}$. Negativen kosinus ima kot v drugem kvadrantu: $\cos\frac{3\pi}{4} = -\frac{\sqrt2}{2}$. Ker $\frac{3\pi}{4}$ leži v $[0, \pi]$, je $\arccos\left(-\frac{\sqrt2}{2}\right) = \frac{3\pi}{4}$.
3. Arkus tangens je lih, zato je $\arctan(-1) = -\arctan 1 = -\frac{\pi}{4}$.
4. Odgovor: vrednosti so $\frac{\pi}{3}$, $\frac{3\pi}{4}$ in $-\frac{\pi}{4}$.

### Primer 2: graf premaknjene krožne funkcije

Določi definicijsko območje, zalogo vrednosti, ničlo in vrednost $f\left(\frac32\right)$ funkcije $f(x) = 2\arcsin(x - 1)$. Skiciraj njen graf.

**Podatki:** $f(x) = 2\arcsin(x - 1)$
**Iščemo:** $D_f$, $Z_f$, ničlo, $f\left(\frac32\right)$ in skico

:::formula
$\arcsin u$ obstaja za $-1 \le u \le 1$ in ima vrednosti v $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$. Odštevanje v argumentu graf premakne vodoravno, faktor pred funkcijo ga raztegne navpično.
:::

**Rešitev:**

1. Argument mora biti med $-1$ in $1$: iz $-1 \le x - 1 \le 1$ sledi $0 \le x \le 2$. Torej $D_f = [0, 2]$; graf arkus sinusa se premakne za $1$ v desno.
2. Faktor $2$ podvoji vse vrednosti: $Z_f = [-\pi, \pi]$.
3. Ničla: $\arcsin(x - 1) = 0$ velja pri $x - 1 = 0$, torej pri $x = 1$.
4. $f\left(\frac32\right) = 2\arcsin\frac12 = 2 \cdot \frac{\pi}{6} = \frac{\pi}{3}$.
5. Funkcija narašča, ker raztezek s pozitivnim faktorjem potek ohrani. Krajišči grafa sta $(0, -\pi)$ in $(2, \pi)$.

:::risba graf
opis: Graf y = 2 arcsin(x − 1) od točke (0; −π) do točke (2; π). Krivulja narašča in seka os x v točki (1; 0). Označena je tudi točka (3/2; π/3).
x: -0,5 .. 2,5 | 0,5 | x
y: -3,5 .. 3,5 | 1 | y
oznake: ne
oznakax: 1 | 1
oznakax: 2 | 2
oznakay: 3,1416 | π
oznakay: -3,1416 | −π
f: 2*arcsin(x - 1) | modra debelo | 0 .. 2
točka: 0; -3,1416
točka: 1; 0 | (1, 0) | desno
točka: 1,5; 1,0472 | (3/2, π/3) | desno
točka: 2; 3,1416
:::

6. Odgovor: $D_f = [0, 2]$, $Z_f = [-\pi, \pi]$, ničla je $x = 1$ in $f\left(\frac32\right) = \frac{\pi}{3}$.

### Primer 3 (težji): kdaj zvočnik doseže polovico odmika

Membrana zvočnika pri tonu s frekvenco $250\,\mathrm{Hz}$ niha po zakonu $y(t) = A\sin(2\pi f t)$, čas je v sekundah. Kdaj po začetku membrana prvič in kdaj drugič doseže odmik $\frac{A}{2}$?

**Podatki:** $f = 250\,\mathrm{Hz}$, $y(t) = A\sin(2\pi f t)$, iskani odmik $y = \frac{A}{2}$, $t > 0$
**Iščemo:** prvi čas $t_1$ in drugi čas $t_2$

:::formula
$\sin(2\pi f t) = \frac12$, rešitve: $2\pi f t = \arcsin\frac12 + 2k\pi$ ali $2\pi f t = \pi - \arcsin\frac12 + 2k\pi$
:::

**Rešitev:**

1. Enačbo $\frac{A}{2} = A\sin(2\pi f t)$ delimo z $A$: $\sin(500\pi t) = \frac12$, ker je $2\pi \cdot 250 = 500\pi$.
2. Arkus sinus da prvo rešitev: $500\pi t_1 = \frac{\pi}{6}$, torej $t_1 = \frac{1}{3000}\,\mathrm{s} \approx 0{,}333\,\mathrm{ms}$.
3. Arkus sinus druge rešitve ne pokaže. Dobimo jo iz $\pi - \frac{\pi}{6} = \frac{5\pi}{6}$: $500\pi t_2 = \frac{5\pi}{6}$, torej $t_2 = \frac{1}{600}\,\mathrm{s} \approx 1{,}67\,\mathrm{ms}$.
4. Smiselnost: nihajni čas je $\frac{1}{250}\,\mathrm{s} = 4\,\mathrm{ms}$. Prvi čas je v prvi četrtini nihaja, ko gre membrana navzgor. Drugi je v drugi četrtini, ko se že vrača.
5. Odgovor: odmik $\frac{A}{2}$ membrana doseže prvič po približno $0{,}333\,\mathrm{ms}$, drugič po približno $1{,}67\,\mathrm{ms}$.

### Primer 4 – zdaj ti: past pri sestavljanju

Izračunaj $\arccos\left(\cos\frac{4\pi}{3}\right)$.

**Podatki:** kot $\frac{4\pi}{3}$
**Iščemo:** vrednost izraza $\arccos\left(\cos\frac{4\pi}{3}\right)$

:::formula
$\arccos(\cos x) = x$ velja samo za $0 \le x \le \pi$; sicer najprej izračunaj kosinus.
:::

**Rešitev:**

1. Kot $\frac{4\pi}{3}$ ni v $[0, \pi]$, zato rezultat ni $\frac{4\pi}{3}$.
2. Kot je v tretjem kvadrantu: $\cos\frac{4\pi}{3} = -\frac12$.
3. Zdaj izračunaj sam, nato preveri:

:::premisli
Koliko je $\arccos\left(-\frac12\right)$?
---
$\frac{2\pi}{3}$. Velja $\cos\frac{2\pi}{3} = -\frac12$ in $\frac{2\pi}{3}$ leži v $[0, \pi]$. Torej je $\arccos\left(\cos\frac{4\pi}{3}\right) = \frac{2\pi}{3}$.
:::

## Pogoste napake

- **»$\sin^{-1} x = \frac{1}{\sin x}$«** (napačno). Oznaka $^{-1}$ tu pomeni obratno funkcijo, ne potence. $\sin^{-1} 0{,}5$ je kot $\frac{\pi}{6}$, ulomek $\frac{1}{\sin x}$ pa je kosekans. Piši $\arcsin$, pa zmede ne bo.
- **»$\arcsin(\sin x)$ je vedno $x$.«** Arkus sinus vrača le kote z $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$, zato je na primer $\arcsin\left(\sin\frac{5\pi}{4}\right) = -\frac{\pi}{4}$. Najprej izračunaj notranjo funkcijo, nato poišči kot v zalogi vrednosti.
- **»Arkus kosinus je lih.«** Kdor misli tako, dobi $\arccos\left(-\frac12\right) = -\frac{\pi}{3}$. Negativni koti niso v $[0, \pi]$. Prav je $\pi - \frac{\pi}{3} = \frac{2\pi}{3}$.
- **»Arkus sinus da vse rešitve enačbe.«** $\arcsin a$ je samo ena rešitev enačbe $\sin x = a$. Drugo družino dobiš iz $\pi - x_1$, nato prišteješ $2k\pi$.
- **Kalkulator v stopinjah.** Če $\arcsin$ izračunaš v stopinjah in rezultat vstaviš v izraz z $2\pi$, je čas napačen za faktor približno $57$. Pri enačbah z $\pi$ preklopi na radiane.

## Povzetek

- Krožne funkcije so obratne funkcije zoženih kotnih funkcij: sinus na $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$, kosinus na $[0, \pi]$, tangens na $\left(-\frac{\pi}{2}, \frac{\pi}{2}\right)$.
- $\arcsin$: $D = [-1, 1]$, $Z = \left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$, narašča, liha.
- $\arccos$: $D = [-1, 1]$, $Z = [0, \pi]$, pada, ni ne soda ne liha; $\arccos(-x) = \pi - \arccos x$.
- $\arctan$: $D = \mathbb{R}$, $Z = \left(-\frac{\pi}{2}, \frac{\pi}{2}\right)$, narašča, liha, vodoravni asimptoti $y = \pm\frac{\pi}{2}$.
- Graf krožne funkcije je zrcalna slika zoženega dela kotne funkcije čez $y = x$.
- $\sin(\arcsin x) = x$ za vse $x \in [-1, 1]$; $\arcsin(\sin x) = x$ samo za $x \in \left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$.
- $\sin^{-1}$ na kalkulatorju je $\arcsin$, ne $\frac{1}{\sin}$. Arkus da le eno rešitev enačbe; ostale dobiš s splošno rešitvijo.

## Drugače: Kot zgodba

Profesorica glasbe pred razredom zaigra ton. Osciloskop ga riše kot sinusni val in v nekem trenutku sliko ustavi: signal je na polovici največje višine. »Kateri del nihaja je to?« vpraša.

Nina reče $30°$. Tim reče $150°$. Eva doda $390°$. Vsi imajo prav, saj ima sinus pri vseh teh kotih vrednost $\frac12$.

Proizvajalec osciloskopa pa je moral izbrati. Zaslon lahko pokaže le eno število, zato je sklenil: »Pokazal bom kot med $-90°$ in $90°$.« Na zaslonu se izpiše $30°$.

Ko profesorica sliko ustavi pri valu, ki pada, se izpiše spet $30°$, čeprav je pravi kot $150°$. Naprava ne laže, samo drži se dogovora. Tak dogovor je arkus sinus. Kdor ve za dogovor, iz $30°$ sam izračuna $180° - 30° = 150°$ in vse kote, ki se od teh dveh razlikujejo za $360°$.

## Drugače: Korak za korakom s številkami

Vrednost krožne funkcije brez računala dobiš v treh korakih.

1. **Preveri definicijsko območje.** Pri $\arcsin$ in $\arccos$ mora biti število med $-1$ in $1$. $\arcsin 2$ ne obstaja.
2. **Poišči ostri kot za absolutno vrednost.** Za $\frac{\sqrt3}{2}$ je to $\frac{\pi}{3}$ pri sinusu in $\frac{\pi}{6}$ pri kosinusu.
3. **Postavi kot v pravi interval.**
   - $\arcsin$ in $\arctan$ negativnega števila: vzemi negativni ostri kot. $\arcsin\left(-\frac{\sqrt2}{2}\right) = -\frac{\pi}{4}$, $\arctan(-\sqrt3) = -\frac{\pi}{3}$.
   - $\arccos$ negativnega števila: odštej od $\pi$. $\arccos\left(-\frac{\sqrt3}{2}\right) = \pi - \frac{\pi}{6} = \frac{5\pi}{6}$.

Tabela znanih vrednosti v radianih:

| $x$ | $\arcsin x$ | $\arccos x$ |
|---|---|---|
| $-1$ | $-\frac{\pi}{2}$ | $\pi$ |
| $-\frac12$ | $-\frac{\pi}{6}$ | $\frac{2\pi}{3}$ |
| $0$ | $0$ | $\frac{\pi}{2}$ |
| $\frac12$ | $\frac{\pi}{6}$ | $\frac{\pi}{3}$ |
| $\frac{\sqrt2}{2}$ | $\frac{\pi}{4}$ | $\frac{\pi}{4}$ |
| $\frac{\sqrt3}{2}$ | $\frac{\pi}{3}$ | $\frac{\pi}{6}$ |
| $1$ | $\frac{\pi}{2}$ | $0$ |

Preizkus: v vsaki vrstici je vsota $\frac{\pi}{2}$. Velja $\arcsin x + \arccos x = \frac{\pi}{2}$ za $-1 \le x \le 1$.

## Preveri se

? Tri od teh vrednosti so enake, ena izstopa: $\arcsin\frac12$, $\arccos\frac{\sqrt3}{2}$, $\arctan\frac{\sqrt3}{3}$, $\arccos\frac12$. Izračunaj jih (brez računala) in vpiši v stopinjah tisto, ki izstopa.
= 60
~ 30 | To je skupna vrednost ostalih treh, $\frac{\pi}{6}$. Izstopa $\arccos\frac12$.
~ 1,05 | To je $\frac{\pi}{3}$ v radianih. Vprašanje zahteva stopinje.
> Prve tri so $\frac{\pi}{6} = 30°$. Izstopa $\arccos\frac12 = \frac{\pi}{3} = 60°$, ker je $\cos 60° = \frac12$.

? Na sliki je graf funkcije $y = 2\arctan x$. Zakaj ima vodoravni asimptoti $y = \pi$ in $y = -\pi$?
:::risba graf
opis: Graf y = 2 arctan x za x od −8 do 8. Krivulja narašča skozi izhodišče. Na desni se približuje sivi črtkani premici y = π, na levi premici y = −π, a ju ne doseže.
x: -8 .. 8 | 2 | x
y: -4 .. 4 | 1 | y
oznake: ne
oznakax: -4 | −4
oznakax: 4 | 4
oznakay: 3,1416 | π
oznakay: -3,1416 | −π
f: 2*arctan(x) | modra debelo
črta: -8; 3,1416 -> 8; 3,1416 | siva črtkano
črta: -8; -3,1416 -> 8; -3,1416 | siva črtkano
:::
- Ker ima tangens periodo $\pi$.
~ Perioda tangensa določa razmik med navpičnimi asimptotami tangensa. Vodoravni asimptoti tu nastaneta iz zaloge vrednosti arkus tangensa.
+ Ker se $\arctan x$ približuje $\pm\frac{\pi}{2}$, njegov dvakratnik pa $\pm\pi$.
- Ker je definicijsko območje funkcije interval $(-\pi, \pi)$.
~ Zamenjal si $D$ in $Z$. Definicijsko območje je $\mathbb{R}$, interval $(-\pi, \pi)$ je zaloga vrednosti.
- Ker je arkus tangens liha funkcija.
~ Lihost pove le, da sta asimptoti simetrični glede na izhodišče, ne pa, zakaj ležita pri $\pm\pi$.
> Arkus tangens ima vodoravni asimptoti $y = \pm\frac{\pi}{2}$. Faktor $2$ graf raztegne v smeri osi $y$, zato se asimptoti premakneta na $y = \pm\pi$.

? Maja računa $\arcsin\left(\sin\frac{5\pi}{4}\right)$. Korak A: $\sin\frac{5\pi}{4} = -\frac{\sqrt2}{2}$. Korak B: ker je sinus kota $\frac{5\pi}{4}$ enak $-\frac{\sqrt2}{2}$, je $\arcsin\left(-\frac{\sqrt2}{2}\right) = \frac{5\pi}{4}$. Korak C: rezultat je $\frac{5\pi}{4}$. Kateri korak je napačen?
- Korak A
~ Korak A je pravilen: $\frac{5\pi}{4}$ je v tretjem kvadrantu, kjer je sinus negativen.
+ Korak B
- Korak C
~ Korak C le prepiše rezultat koraka B. Napaka je nastala prej.
- Noben, rezultat je pravilen.
~ Arkus sinus vrača le kote z $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$, kot $\frac{5\pi}{4}$ pa ni v tem intervalu.
> V koraku B mora Maja izbrati kot z $\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]$: $\arcsin\left(-\frac{\sqrt2}{2}\right) = -\frac{\pi}{4}$. Rezultat je $-\frac{\pi}{4}$.

? Ton s frekvenco $200\,\mathrm{Hz}$ niha po zakonu $y(t) = A\sin(2\pi \cdot 200\, t)$, čas je v sekundah. Čez koliko milisekund po začetku membrana prvič doseže odmik $0{,}8A$? Zaokroži na tri decimalke.
= 0,738 ms | 0,002
~ 42,28 | Kalkulator je računal v stopinjah ($\arcsin 0{,}8 \approx 53{,}13°$). Izraz $2\pi \cdot 200\, t$ je v radianih.
~ 4,636 | Delil si samo z $200$. Kot je $2\pi \cdot 200\, t = 400\pi t$, deliti moraš s $400\pi$.
~ 1,762 | To je drugi čas, iz $\pi - \arcsin 0{,}8$. Prvi je tisti, ki ga da arkus sinus.
> $\sin(400\pi t) = 0{,}8$; $400\pi t_1 = \arcsin 0{,}8 \approx 0{,}9273$; $t_1 \approx 0{,}000738\,\mathrm{s} = 0{,}738\,\mathrm{ms}$.

? Razvrsti korake za rešitev enačbe $2\sin x = -1$ na intervalu $[0, 2\pi)$.
1. Deli z $2$: $\sin x = -\frac12$.
2. Izračunaj $x_1 = \arcsin\left(-\frac12\right) = -\frac{\pi}{6}$.
3. Zapiši obe družini: $x = -\frac{\pi}{6} + 2k\pi$ ali $x = \frac{7\pi}{6} + 2k\pi$.
4. Izberi rešitvi z intervala $[0, 2\pi)$: $\frac{7\pi}{6}$ in $\frac{11\pi}{6}$.
> Arkus sinus da le $-\frac{\pi}{6}$, ki ni v $[0, 2\pi)$. Druga družina je $\pi - x_1 = \frac{7\pi}{6}$; iz prve pri $k = 1$ dobiš $\frac{11\pi}{6}$.

<<RACUN
vrednost: 1/sin(pi/6) | 2
vrednost: asin(1/2) | pi/6
vrednost: acos(-1/2) | 2*pi/3
vrednost: asin(sqrt(3)/2) | pi/3
vrednost: acos(-sqrt(2)/2) | 3*pi/4
vrednost: atan(-1) | -pi/4
vrednost: atan(-sqrt(3)) | -pi/3
vrednost: 2*asin(1/2) | pi/3
resi: 2*asin(x-1)=0 | x | 1
resi: 500*pi*t=pi/6 | t | 1/3000
resi: 500*pi*t=5*pi/6 | t | 1/600
vrednost: asin(sin(5*pi/6)) | pi/6
vrednost: atan(tan(3*pi/4)) | -pi/4
vrednost: acos(cos(-pi/3)) | pi/3
vrednost: acos(cos(4*pi/3)) | 2*pi/3
vrednost: asin(sin(5*pi/4)) | -pi/4
vrednost: acos(-sqrt(3)/2) | 5*pi/6
vrednost: acos(1/2)*180/pi | 60
vrednost: asin(0.8)/(400*pi)*1000 | 0.738
limita: 2*atan(x) | x | oo | pi
resi: 2*sin(x)=-1 | x | -pi/6+2*k*pi, 7*pi/6+2*k*pi
>>

:::simboli
x | neodvisna spremenljivka (število ali kot) | |
y | odvisna spremenljivka, kot; v Primeru 3 odmik membrane | |
A | amplituda, največji odmik membrane | |
f | frekvenca tona; v Primeru 2 ime funkcije | | Hz
t | čas | | s
t_1 | prvi čas z odmikom $\frac{A}{2}$ | | s
t_2 | drugi čas z odmikom $\frac{A}{2}$ | | s
x_1 | rešitev, ki jo da arkus | x_1 = \arcsin a |
a | desna stran enačbe $\sin x = a$ | |
k | poljubno celo število | |
D, D_f | definicijsko območje | |
Z, Z_f | zaloga vrednosti | |
u | argument arkus sinusa | |
:::
