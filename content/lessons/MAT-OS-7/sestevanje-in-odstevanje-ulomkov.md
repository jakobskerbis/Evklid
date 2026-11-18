---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nika na treningu plavanja zjutraj preplava $\frac{1}{2}$ km, popoldne še $\frac{1}{3}$ km. Koliko je preplavala ta dan?

Doma babica speče pito. Pri kosilu družina poje $\frac{1}{2}$ pite, zvečer še $\frac{1}{3}$. Kolikšen del pite je izginil?

Zgodbi sta na videz povsem različni: ena govori o bazenu, druga o pecivu. Skriva pa se v njiju isti račun, $\frac{1}{2} + \frac{1}{3}$, in ista težava. Polovice in tretjine so različno veliki kosi, zato jih ne moremo kar prešteti.

Kdor zna sešteti ali odšteti ulomka z različnima imenovalcema, reši obe nalogi z enim postopkom. Pri športu ga rabiš ves čas: za čas treninga, za del proge ali za to, koliko tekme je še ostalo. Ko vsota preseže celoto, dobiš **mešano število**, na primer $1\frac{1}{2}$ ure treninga.

## Razlaga

**Najprej en primer: Nikin dan v bazenu.** Kilometer si predstavljaj kot trak. Razrežemo ga na $6$ enakih kosov, šestin. Polovico traku sestavljajo $3$ taki kosi, tretjino pa $2$:

| Del treninga | Zapis | V šestinah |
|---|---|---|
| zjutraj | $\frac{1}{2}$ km | $\frac{3}{6}$ km |
| popoldne | $\frac{1}{3}$ km | $\frac{2}{6}$ km |
| skupaj | ? | $\frac{5}{6}$ km |

Ko sta oba dela zapisana v šestinah, kose preprosto preštejemo: $3 + 2 = 5$ šestin. Nika je preplavala $\frac{5}{6}$ km. Babičina družina je pojedla $\frac{5}{6}$ pite.

:::premisli
Sošolec trdi, da je vsota $\frac{1}{2} + \frac{1}{3}$ enaka $\frac{2}{5}$, ker je seštel števca in imenovalca. Kako brez računanja vidiš, da to ne more biti prav? Namig: primerjaj s $\frac{1}{2}$.
---
$\frac{2}{5}$ je manj kot $\frac{1}{2}$, ker je $2 \cdot 2 < 5$. Če polovici nekaj prišteješ, ne more nastati manj kot polovica. Pravilni rezultat je $\frac{5}{6}$.
:::

**Zakaj ravno šestine?** Potrebovali smo kose, na katere razrežemo polovico in tretjino brez ostanka. Število kosov mora zato biti večkratnik števil $2$ in $3$. Najmanjši tak je $v(2, 3) = 6$. Temu številu rečemo **skupni imenovalec**. Ustrezala bi tudi $12$ ali $18$, a števila bi bila večja in rezultat bi morali še krajšati.

**Prva posplošitev: enaka imenovalca.** Če sta kosa že enako velika, ju samo preštejemo. Seštejemo ali odštejemo števca, imenovalec ostane:

$$\frac{a}{c} + \frac{b}{c} = \frac{a + b}{c}$$

$$\frac{a}{c} - \frac{b}{c} = \frac{a - b}{c}$$

Na primer $\frac{2}{7} + \frac{3}{7} = \frac{5}{7}$. Imenovalca ne seštevamo, ker pove velikost kosov: sedmine ostanejo sedmine.

**Druga posplošitev: različna imenovalca.** Nikin račun zapišemo kot postopek v štirih korakih:

1. Poišči najmanjši skupni večkratnik imenovalcev.
2. Vsak ulomek razširi na ta imenovalec.
3. Seštej ali odštej števca, imenovalec prepiši.
4. Rezultat okrajšaj, če se da.

Odštevanje teče enako: $\frac{1}{2} - \frac{1}{3} = \frac{3}{6} - \frac{2}{6} = \frac{1}{6}$.

**Mešana števila.** Število $2\frac{3}{5}$ je vsota celega dela in ulomka: $2 + \frac{3}{5}$. Pretvorimo ga v **nepravi ulomek** (števec je večji od imenovalca ali enak njemu) tako, da celi del pomnožimo z imenovalcem in prištejemo števec:

$$2\frac{3}{5} = \frac{2 \cdot 5 + 3}{5} = \frac{13}{5}$$

Nazaj gre z deljenjem z ostankom. Pri $\frac{17}{5}$ je $17 = 3 \cdot 5 + 2$, količnik $3$ je celi del, ostanek $2$ novi števec: $\frac{17}{5} = 3\frac{2}{5}$.

**Računanje z mešanimi števili.** Izbereš lahko eno od dveh poti:

- Obe števili pretvoriš v neprava ulomka in računaš kot zgoraj.
- Cele dele in ulomke računaš posebej. Če je pri odštevanju odštevani ulomek večji, si od celega dela **sposodiš** eno celoto. Na primer $3\frac{3}{12} = 2\frac{15}{12}$, ker je $1 = \frac{12}{12}$.

:::premisli
Ali je $3\frac{1}{4} - 1\frac{5}{6}$ več ali manj kot $2$? Napovej brez natančnega računa.
---
Manj. Najprej odštejemo celoto: $3\frac{1}{4} - 1 = 2\frac{1}{4}$. Nato odštejemo še $\frac{5}{6}$, kar je več kot $\frac{1}{4}$, zato pademo pod $2$. Natančen rezultat je $1\frac{5}{12}$ (Primer 3).
:::

V simulaciji spodaj (»Seštevanje in odštevanje ulomkov«) nastavi $\frac{3}{4} + \frac{1}{6}$. Opazuj, na koliko enakih kosov se razdelita oba trakova in koliko kosov dobi rezultat. Preveri, da je kosov $v(4, 6) = 12$ in da je vsota $\frac{11}{12}$.

## Rešeni primeri

### Primer 1: kolesarska dirka

Kolesar Matic je v prvi uri dirke prevozil $\frac{3}{8}$ proge, v drugi uri pa $\frac{1}{4}$ proge. Kolikšen del proge je prevozil v dveh urah?

**Podatki:** prva ura $\frac{3}{8}$ proge, druga ura $\frac{1}{4}$ proge
**Iščemo:** skupni del proge $x$

:::formula
$x = \frac{3}{8} + \frac{1}{4}$; oba ulomka razširimo na $v(8, 4)$ in seštejemo števca.
:::

**Rešitev:**

1. Najmanjši skupni večkratnik je $v(8, 4) = 8$, ker je $8$ že večkratnik števila $4$.
2. Razširimo le drugi ulomek, z $2$: $\frac{1}{4} = \frac{1 \cdot 2}{4 \cdot 2} = \frac{2}{8}$.
3. Seštejemo števca: $\frac{3}{8} + \frac{2}{8} = \frac{5}{8}$.
4. Števili $5$ in $8$ sta tuji, zato rezultata ne moremo krajšati.
5. Odgovor: Matic je v dveh urah prevozil $\frac{5}{8}$ proge.

### Primer 2: dva plavalca

Žan je na treningu preplaval $\frac{5}{6}$ km, Tim pa $\frac{1}{10}$ km manj. Koliko je preplaval Tim?

**Podatki:** Žan $\frac{5}{6}$ km, Tim $\frac{1}{10}$ km manj kot Žan
**Iščemo:** Timova razdalja $x$

:::formula
$x = \frac{5}{6} - \frac{1}{10}$; skupni imenovalec je $v(6, 10)$.
:::

**Rešitev:**

1. »Manj« pomeni odštevanje: $x = \frac{5}{6} - \frac{1}{10}$.
2. Ker je $6 = 2 \cdot 3$ in $10 = 2 \cdot 5$, je $v(6, 10) = 2 \cdot 3 \cdot 5 = 30$.
3. Razširimo: $\frac{5}{6} = \frac{25}{30}$ (s $5$) in $\frac{1}{10} = \frac{3}{30}$ (s $3$).
4. Odštejemo števca: $\frac{25}{30} - \frac{3}{30} = \frac{22}{30}$.
5. Krajšamo z $D(22, 30) = 2$: $\frac{22}{30} = \frac{11}{15}$.
6. Odgovor: Tim je preplaval $\frac{11}{15}$ km.

### Primer 3: orientacijski tek v treh etapah

Ekipa ima za orientacijski tek s tremi etapami na voljo $3\frac{1}{4}$ ure. Prva etapa ji je vzela $1\frac{1}{2}$ ure, druga $\frac{1}{3}$ ure. Koliko časa ji ostane za tretjo etapo? Izrazi rezultat tudi v urah in minutah.

**Podatki:** na voljo $3\frac{1}{4}$ h, prva etapa $1\frac{1}{2}$ h, druga etapa $\frac{1}{3}$ h
**Iščemo:** čas $t$, ki ostane za tretjo etapo

:::formula
$t = 3\frac{1}{4} - \left(1\frac{1}{2} + \frac{1}{3}\right)$
:::

**Rešitev:**

1. Porabljeni čas. Ker je $v(2, 3) = 6$: $1\frac{1}{2} + \frac{1}{3} = 1\frac{3}{6} + \frac{2}{6} = 1\frac{5}{6}$ ure.
2. Ostane $3\frac{1}{4} - 1\frac{5}{6}$. Pretvorimo v neprava ulomka: $\frac{13}{4}$ in $\frac{11}{6}$.
3. Skupni imenovalec $v(4, 6) = 12$: $\frac{13}{4} = \frac{39}{12}$ in $\frac{11}{6} = \frac{22}{12}$.
4. Odštejemo: $\frac{39}{12} - \frac{22}{12} = \frac{17}{12}$.
5. Nazaj v mešano število: $17 = 1 \cdot 12 + 5$, zato $\frac{17}{12} = 1\frac{5}{12}$.
6. V minutah: $\frac{1}{12}$ ure je $5$ minut, zato je $\frac{5}{12}$ ure $5 \cdot 5 = 25$ minut.
7. Preizkus po drugi poti (cele dele posebej): $3\frac{3}{12} - 1\frac{10}{12}$. Ker je $\frac{3}{12}$ manj kot $\frac{10}{12}$, si sposodimo celoto: $2\frac{15}{12} - 1\frac{10}{12} = 1\frac{5}{12}$.
8. Odgovor: za tretjo etapo ostane $1\frac{5}{12}$ ure, to je $1$ ura in $25$ minut.

### Primer 4 – zdaj ti

Kolesarka je v soboto kolesarila $2\frac{2}{3}$ ure, v nedeljo pa $1\frac{3}{4}$ ure. Koliko časa je kolesarila v obeh dneh skupaj?

**Podatki:** sobota $2\frac{2}{3}$ h, nedelja $1\frac{3}{4}$ h
**Iščemo:** skupni čas $t$

:::formula
$t = 2\frac{2}{3} + 1\frac{3}{4}$; neprava ulomka razširimo na $v(3, 4)$.
:::

**Rešitev:**

1. Neprava ulomka: $2\frac{2}{3} = \frac{8}{3}$ in $1\frac{3}{4} = \frac{7}{4}$.
2. Skupni imenovalec $v(3, 4) = 12$: $\frac{8}{3} = \frac{32}{12}$ in $\frac{7}{4} = \frac{21}{12}$.
3. Seštej sam, zapiši kot mešano število in nato preveri:

:::premisli
Koliko je $\frac{32}{12} + \frac{21}{12}$ kot mešano število? Koliko ur in minut je to?
---
$\frac{53}{12} = 4\frac{5}{12}$, ker je $53 = 4 \cdot 12 + 5$. To so $4$ ure in $25$ minut.
:::

## Pogoste napake

- **Seštevanje imenovalcev.** »$\frac{1}{2} + \frac{1}{3} = \frac{2}{5}$.« Imenovalec pove velikost kosov. Seštevaš kose, ne njihovih velikosti, in $\frac{2}{5}$ je celo manj od $\frac{1}{2}$. Popravek: najprej skupni imenovalec, $\frac{3}{6} + \frac{2}{6} = \frac{5}{6}$.
- **Razširjen samo imenovalec.** »Potrebujem dvanajstine, torej $\frac{1}{4} = \frac{1}{12}$.« Tako dobiš trikrat manj, kot je bilo. Popravek: števec pomnoži z istim številom kot imenovalec, $\frac{1}{4} = \frac{3}{12}$.
- **Mešano število kot zmnožek.** »$2\frac{3}{5} = 2 \cdot \frac{3}{5} = \frac{6}{5}$.« Med celim delom in ulomkom se skriva $+$, ne $\cdot$. Popravek: $2\frac{3}{5} = 2 + \frac{3}{5} = \frac{13}{5}$.
- **Obrnjeno odštevanje ulomkov.** Pri $4\frac{2}{6} - 2\frac{3}{6}$ učenec reče: »$\frac{2}{6} - \frac{3}{6}$ ne gre, zato računam $\frac{3}{6} - \frac{2}{6}$« in dobi $2\frac{1}{6}$. Odšteti pa moraš $\frac{3}{6}$, ne $\frac{2}{6}$. Popravek: sposodi si celoto, $3\frac{8}{6} - 2\frac{3}{6} = 1\frac{5}{6}$.
- **Sposojena celota ostane tudi v celem delu.** »$4\frac{2}{6} = 4\frac{8}{6}$.« Ulomku si dodal $\frac{6}{6} = 1$, celemu delu pa nisi nič vzel, zato je število zraslo za $1$. Popravek: ko si sposodiš celoto, celi del zmanjšaj za $1$, $4\frac{2}{6} = 3\frac{8}{6}$.

## Povzetek

- Pri enakih imenovalcih seštejemo ali odštejemo števca, imenovalec ostane.
- Pri različnih imenovalcih ulomka najprej razširimo na skupni imenovalec (najbolje najmanjši skupni večkratnik imenovalcev).
- Razširjamo vedno števec in imenovalec z istim številom.
- Mešano število je vsota: $a\frac{b}{c} = a + \frac{b}{c} = \frac{a \cdot c + b}{c}$.
- Pri mešanih številih pretvorimo v neprave ulomke ali računamo cele dele in ulomke posebej; pri odštevanju si po potrebi sposodimo celoto in celi del zmanjšamo za $1$.
- Rezultat okrajšamo, nepravi ulomek pa zapišemo kot mešano število.

## Drugače: Z analogijo

V denarnici imaš $2$ kovanca po $50$ centov in $3$ kovance po $20$ centov. Ali imaš »$5$ kovancev denarja«? Število kovancev ne pove, koliko denarja imaš, ker kovanci niso enako vredni. Zato vse preračunaš v cente: $2 \cdot 50 + 3 \cdot 20 = 160$ centov.

Pri ulomkih je imenovalec vrsta kovanca, števec pa število kovancev. Polovice in tretjine so različni »kovanci«. Šestine so skupna enota, podobno kot centi. Števce smemo sešteti šele, ko so vsi kosi iste vrste.

Primerjava ima mejo: pri denarju je skupna enota vedno cent, pri ulomkih pa jo vsakič poiščeš znova, kot najmanjši skupni večkratnik imenovalcev.

## Drugače: Iz vsakdanjega življenja

Pri peki potrebuješ $1\frac{1}{2}$ skodelice moke za testo in še $\frac{3}{4}$ skodelice za posip. Koliko moke potrebuješ skupaj?

Pomagaš si s četrtinami: $1\frac{1}{2} = 1\frac{2}{4}$. Skupaj je $1\frac{2}{4} + \frac{3}{4} = 1\frac{5}{4} = 2\frac{1}{4}$ skodelice. Ker je $\frac{5}{4}$ več kot celota, smo $\frac{4}{4}$ prenesli v celi del.

Podobno pri času: ura in tričetrt ($1\frac{3}{4}$ h) in še pol ure ($\frac{1}{2}$ h) je $1\frac{3}{4} + \frac{2}{4} = 1\frac{5}{4} = 2\frac{1}{4}$ h, to sta $2$ uri in $15$ minut.

## Drugače: Bolj natančno

Zakaj lahko ulomek razširimo, ne da bi spremenili njegovo vrednost? Ker razširjanje pomeni množenje z $1$ v obliki $\frac{k}{k}$:

$$\frac{a}{b} = \frac{a}{b} \cdot \frac{k}{k} = \frac{a \cdot k}{b \cdot k}$$

Zakaj lahko pri enakih imenovalcih seštejemo samo števce? Ulomek $\frac{a}{c}$ pomeni $a$ kosov velikosti $\frac{1}{c}$. Če imamo $a$ kosov in še $b$ kosov iste velikosti, imamo $a + b$ kosov te velikosti, torej $\frac{a + b}{c}$.

Skupni imenovalec ni nujno najmanjši skupni večkratnik. Lahko uporabimo tudi zmnožek imenovalcev: $\frac{1}{4} + \frac{1}{6} = \frac{6}{24} + \frac{4}{24} = \frac{10}{24} = \frac{5}{12}$. Račun je pravilen, a večja števila zahtevajo več krajšanja. Z najmanjšim skupnim večkratnikom ($12$) pridemo do istega rezultata hitreje: $\frac{3}{12} + \frac{2}{12} = \frac{5}{12}$.

V splošnem: $\frac{a}{b} + \frac{c}{d} = \frac{a \cdot d + c \cdot b}{b \cdot d}$. Ta formula vedno deluje, rezultat pa je treba pogosto še okrajšati.

## Preveri se

? Trener reče: »Na tekmi si igral $1\frac{3}{4}$ ure.« Kaj pomeni mešano število $1\frac{3}{4}$?
- $1 \cdot \frac{3}{4}$ ure, torej $\frac{3}{4}$ ure
~ Mešano število ni zmnožek. Med celim delom in ulomkom se skriva znak $+$.
+ $1 + \frac{3}{4}$ ure, torej $1$ ura in $45$ minut
- $1$ ura in $34$ minut
~ Ulomka ne moreš brati kot minut. Četrtina ure je $15$ minut, tri četrtine so $45$ minut.
- $\frac{13}{4}$ ure
~ Števke si le zložil skupaj. Pravilna pretvorba je $\frac{1 \cdot 4 + 3}{4} = \frac{7}{4}$.
> Mešano število je vsota celega dela in ulomka: $1\frac{3}{4} = 1 + \frac{3}{4} = \frac{7}{4}$ ure. Tri četrtine ure so $3 \cdot 15 = 45$ minut.

? Na treningu so tekli: Ana $\frac{1}{2} + \frac{1}{4}$ kroga, Bor $\frac{2}{3}$ kroga, Cene $\frac{1}{3} + \frac{1}{2}$ kroga. Uredi jih od najkrajše do najdaljše razdalje.
+ Bor, Ana, Cene
- Ana, Cene, Bor
~ Tak vrstni red dobiš, če seštevaš števca in imenovalca: Ana $\frac{2}{6}$, Cene $\frac{2}{5}$. Pravilni vsoti sta $\frac{3}{4}$ in $\frac{5}{6}$.
- Cene, Ana, Bor
~ To je vrstni red od najdaljše do najkrajše razdalje, vprašanje pa sprašuje obratno.
- Ana, Bor, Cene
~ $\frac{3}{4}$ in $\frac{2}{3}$ sta blizu, a na skupnem imenovalcu je $\frac{9}{12} > \frac{8}{12}$, zato je Ana pretekla več kot Bor.
> Ana: $\frac{3}{4} = \frac{9}{12}$, Bor: $\frac{2}{3} = \frac{8}{12}$, Cene: $\frac{5}{6} = \frac{10}{12}$. Od najkrajše razdalje: Bor, Ana, Cene.

? Kaj se zgodi, če pri $\frac{1}{4} + \frac{1}{6}$ namesto najmanjšega skupnega imenovalca $12$ vzameš imenovalec $24$?
+ Dobiš $\frac{10}{24}$, kar se okrajša na isti rezultat $\frac{5}{12}$.
- Rezultat bo napačen, ker $24$ ni najmanjši skupni večkratnik.
~ Ustreza vsak skupni večkratnik imenovalcev. Najmanjši je le najbolj priročen, ker so števila manjša.
- Rezultat bo dvakrat večji.
~ Razširjanje ne spremeni vrednosti ulomkov, zato se ne spremeni niti vsota. Spremeni se le zapis.
- Tega ne moreš narediti, ker se $\frac{1}{6}$ ne da razširiti na $24$.
~ Da se: $24 : 6 = 4$, zato $\frac{1}{6} = \frac{4}{24}$.
> $\frac{1}{4} = \frac{6}{24}$ in $\frac{1}{6} = \frac{4}{24}$, vsota je $\frac{10}{24} = \frac{5}{12}$. Vsak skupni imenovalec da pravi rezultat, pri najmanjšem je le manj krajšanja.

? Odbojkarica je na treningu $\frac{3}{4}$ ure vadila servis in $\frac{2}{3}$ ure napad. Koliko časa je vadila skupaj?
- $\frac{5}{7}$ ure
~ Seštel si števca in imenovalca. Četrtine in tretjine moraš najprej pretvoriti v dvanajstine.
- $\frac{5}{12}$ ure
~ Razširil si le imenovalca ($\frac{3}{12} + \frac{2}{12}$). Tudi števca moraš pomnožiti: $\frac{9}{12}$ in $\frac{8}{12}$.
+ $1\frac{5}{12}$ ure
> $v(4, 3) = 12$, $\frac{3}{4} = \frac{9}{12}$ in $\frac{2}{3} = \frac{8}{12}$. Vsota je $\frac{17}{12} = 1\frac{5}{12}$ ure, to je $1$ ura in $25$ minut.

? Proga gorskega teka je dolga $4\frac{1}{3}$ km. Tekač je pretekel $2\frac{1}{2}$ km. Koliko mu še manjka do cilja?
- $2\frac{1}{6}$ km
~ Ulomka si obrnil in računal $\frac{3}{6} - \frac{2}{6}$. Ko je odštevani ulomek večji, si sposodi celoto.
+ $1\frac{5}{6}$ km
- $2\frac{5}{6}$ km
~ Celoto si sposodil ($\frac{8}{6}$), celega dela $4$ pa nisi zmanjšal na $3$. Rezultat je za $1$ prevelik.
- $1\frac{1}{6}$ km
~ Celi del si zmanjšal, ulomka pa vseeno odštel v obratnem vrstnem redu ($\frac{3}{6} - \frac{2}{6}$).
> $4\frac{1}{3} - 2\frac{1}{2} = 4\frac{2}{6} - 2\frac{3}{6} = 3\frac{8}{6} - 2\frac{3}{6} = 1\frac{5}{6}$ km. Preizkus: $2\frac{3}{6} + 1\frac{5}{6} = 3\frac{8}{6} = 4\frac{2}{6}$.

:::simboli
a, b | števca ulomkov | | | v a/b = a · k / (b · k) je b imenovalec; v mešanem številu je a celi del
c | skupni imenovalec | | | c ≠ 0; v a/b + c/d je c števec
k | število, s katerim razširimo ulomek | | | k ≠ 0
x | iskani del proge | | | v primeru 2 Timova razdalja
t | čas, ki ostane za tretjo etapo | | h | v primeru 4 skupni čas kolesarjenja
v | najmanjši skupni večkratnik imenovalcev | | | najmanjši skupni imenovalec
:::
