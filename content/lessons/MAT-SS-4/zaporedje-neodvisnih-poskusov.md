---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

*(višja raven) Zaporedje neodvisnih poskusov in Bernoullijevo formulo matura preverja samo na višji ravni.*

Maja igra električno kitaro in se prijavlja na sprejemni preizkus glasbene šole. Komisija ji bo dala težak rif (kratek kitarski motiv), ki ga mora zaigrati petkrat zapored. Sprejmejo jo, če ga vsaj štirikrat zaigra brez napake. Na vajah ji to uspe v $8$ od $10$ poskusov, zato vzame verjetnost $p = 0{,}8$ za en poskus.

Maja se sprašuje, ali je $0{,}8$ dovolj. Bo sprejeta s tolikšno verjetnostjo ali precej manjšo? Ugibanje ne pomaga: rif lahko pokvari prvič, tretjič ali petič, in vsak tak potek je treba upoštevati. Do konca lekcije boš znal izračunati odgovor v dveh vrsticah. Isti račun uporabljajo pri kontroli kakovosti (koliko izdelkov v seriji je pokvarjenih), v genetiki in pri vsaki nalogi, kjer se isti poskus ponavlja.

## Razlaga

**1. En primer do konca.** Začnimo z manjšim vprašanjem. Maja zaigra rif trikrat. Kolikšna je verjetnost, da ji uspe natanko dvakrat?

Z $Z$ označimo uspešen poskus (rif brez napake), z $N$ neuspešen. $P(Z) = 0{,}8$, $P(N) = 0{,}2$. Natanko dva uspeha se lahko zgodita na tri načine:

| potek | verjetnost poteka |
|---|---|
| $ZZN$ | $0{,}8 \cdot 0{,}8 \cdot 0{,}2 = 0{,}128$ |
| $ZNZ$ | $0{,}8 \cdot 0{,}2 \cdot 0{,}8 = 0{,}128$ |
| $NZZ$ | $0{,}2 \cdot 0{,}8 \cdot 0{,}8 = 0{,}128$ |

Znotraj enega poteka verjetnosti posameznih poskusov množimo, ker en poskus ne vpliva na drugega (dogodki so neodvisni). Poteki se med seboj izključujejo, zato jih seštejemo: $3 \cdot 0{,}128 = 0{,}384$.

:::premisli
Zakaj imajo vsi trije poteki enako verjetnost, čeprav je napaka vsakič drugje?
---
Ker je v vsakem poteku natanko dvakrat faktor $0{,}8$ in enkrat $0{,}2$. Pri množenju vrstni red faktorjev ne vpliva na zmnožek.
:::

**2. Kaj iz primera velja splošno.** Recimo, da poskus ponovimo $n$-krat in uspe vsakič z verjetnostjo $p$. Opazimo dve stvari:

- vsak potek z $k$ uspehi ima verjetnost $p^k q^{n-k}$, kjer je $q = 1 - p$;
- takih potekov je toliko, kolikor je načinov, da izmed $n$ poskusov izberemo $k$ uspešnih, torej $\binom{n}{k}$. V primeru je $\binom{3}{2} = 3$.

**3. Zaporedje neodvisnih poskusov.** Tako lahko računamo, kadar velja vse troje:

- isti poskus ponovimo $n$-krat;
- zanima nas le, ali se dogodek $A$ zgodi ali ne, in $P(A) = p$ je pri vsaki ponovitvi enaka;
- poskusi so neodvisni: izid enega ne spremeni verjetnosti pri drugem.

Tako zaporedje imenujemo **zaporedje neodvisnih poskusov** (tudi Bernoullijevo zaporedje). Verjetnost, da se dogodek $A$ v $n$ poskusih zgodi natanko $k$-krat, da **Bernoullijeva formula**:

$$P_n(k) = \binom{n}{k}p^k q^{n-k}$$

Vlečenje kart iz kupa brez vračanja ni tako zaporedje: ko izvlečeš asa, je asov v kupu manj in verjetnost se spremeni.

**4. Vse verjetnosti skupaj.** Za $n = 3$ in $p = 0{,}8$ izračunamo vse štiri možnosti:

:::risba stolpci
opis: Stolpčni prikaz verjetnosti P₃(k) v odstotkih za p = 0,8. Nič uspehov 0,8 %, en uspeh 9,6 %, dva uspeha 38,4 %, trije uspehi 51,2 %. Skupaj 100 %.
podnapis: Verjetnost k uspehov v 3 poskusih (p = 0,8)
os: verjetnost (%)
korak: 10
stolpec: k = 0 | 0,8
stolpec: k = 1 | 9,6
stolpec: k = 2 | 38,4
stolpec: k = 3 | 51,2
:::

Vsota je $0{,}008 + 0{,}096 + 0{,}384 + 0{,}512 = 1$. To ni naključje. Členi $q^3$, $3pq^2$, $3p^2q$, $p^3$ so natanko členi razvoja $(q+p)^3$ po binomskem izreku. Zato za vsak $n$ velja

$$P_n(0) + P_n(1) + \dots + P_n(n) = (q+p)^n = 1^n = 1$$

in Bernoullijeva formula je le en člen binomskega razvoja.

**5. »Vsaj« in »največ«.** »Vsaj $k$« pomeni $k$ ali več, »največ $k$« pomeni $k$ ali manj. Kadar bi morali sešteti veliko členov, je krajša pot nasprotni dogodek. Nasprotni dogodek dogodka »vsaj en uspeh« je »nobenega uspeha«:

$$P(\text{vsaj en uspeh}) = 1 - P_n(0) = 1 - q^n$$

Podobno je nasprotni dogodek dogodka »vsaj $2$« dogodek »največ $1$«, torej $k = 0$ ali $k = 1$.

:::premisli
Kaj se zgodi z verjetnostjo »vsaj en uspeh«, ko število poskusov $n$ raste, $p$ pa ostane enak? Napovej, preden računaš.
---
Raste proti $1$. Ker je $0 < q < 1$, postaja $q^n$ vse manjši, $1 - q^n$ pa se približuje $1$. Z dovolj poskusi skoraj gotovo vsaj enkrat uspeš.
:::

## Rešeni primeri

### Primer 1 (lažji): lestvica brez napake

Pianist pri vaji zaigra hitro lestvico brez napake z verjetnostjo $0{,}9$. Zaigra jo štirikrat. Kolikšna je verjetnost, da mu natanko trikrat uspe?

**Podatki:** $n = 4$, $k = 3$, $p = 0{,}9$, $q = 0{,}1$
**Iščemo:** $P_4(3)$

:::formula
$P_n(k) = \binom{n}{k}p^k q^{n-k}$
:::

**Rešitev:**

1. Poskusi so neodvisni in $p$ je vsakič enak, zato uporabimo Bernoullijevo formulo.
2. En potek, na primer $ZZZN$, ima verjetnost $0{,}9^3 \cdot 0{,}1 = 0{,}0729$.
3. Pokvarjeni poskus je lahko kateri koli od štirih: $\binom{4}{3} = 4$.
4. $P_4(3) = 4 \cdot 0{,}0729 = 0{,}2916$.
5. Odgovor: verjetnost je približno $0{,}29$, torej okoli $29\,\%$.

### Primer 2: glasbeni kviz

V radijskem kvizu predvajajo $6$ odlomkov. Pri vsakem tekmovalec izbere skladbo med $6$ ponujenimi. Tine ne pozna nobene in vsakič ugiba. Kolikšna je verjetnost, da ugane vsaj enega? In kolikšna, da ugane največ enega?

**Podatki:** $n = 6$, $p = \frac{1}{6}$, $q = \frac{5}{6}$
**Iščemo:** $P(\text{vsaj } 1)$ in $P(\text{največ } 1)$

:::formula
$P(\text{vsaj } 1) = 1 - P_6(0)$, $P(\text{največ } 1) = P_6(0) + P_6(1)$
:::

**Rešitev:**

1. Nobenega ne ugane: $P_6(0) = \left(\frac{5}{6}\right)^6 \approx 0{,}3349$.
2. »Vsaj en« je nasprotni dogodek: $1 - 0{,}3349 = 0{,}6651$.
3. Natanko enega: $P_6(1) = 6 \cdot \frac{1}{6} \cdot \left(\frac{5}{6}\right)^5 \approx 0{,}4019$.
4. »Največ en« pomeni $0$ ali $1$: $0{,}3349 + 0{,}4019 = 0{,}7368$.
5. Odgovor: vsaj enega ugane z verjetnostjo približno $0{,}665$, največ enega pa z verjetnostjo približno $0{,}737$.

### Primer 3 (težji): koliko posnetkov

V studiu snemajo vokal. Posnetek je brez motečega šuma z verjetnostjo $0{,}3$, posnetki so med seboj neodvisni. Najmanj kolikokrat morajo posneti, da bodo z verjetnostjo vsaj $0{,}95$ imeli vsaj en čist posnetek?

**Podatki:** $p = 0{,}3$, $q = 0{,}7$, zahtevana verjetnost $0{,}95$
**Iščemo:** najmanjši $n$

:::formula
$1 - q^n \ge 0{,}95$
:::

**Rešitev:**

1. Neznanka je število poskusov, zato vzamemo nasprotni dogodek »noben posnetek ni čist«, ki ima verjetnost $0{,}7^n$.
2. Pogoj $1 - 0{,}7^n \ge 0{,}95$ preoblikujemo v $0{,}7^n \le 0{,}05$.
3. Logaritmiramo. Ker je $\ln 0{,}7 < 0$, se znak neenakosti obrne: $n \ge \frac{\ln 0{,}05}{\ln 0{,}7} \approx 8{,}40$.
4. Preizkus: pri $n = 8$ je $1 - 0{,}7^8 \approx 0{,}942$, premalo; pri $n = 9$ je $1 - 0{,}7^9 \approx 0{,}960$.
5. Odgovor: posneti morajo najmanj $9$-krat.

### Primer 4: zdaj ti (Majin preizkus)

Vrnimo se k Maji. Kolikšna je verjetnost, da v $5$ poskusih rif zaigra brez napake vsaj štirikrat, če je $p = 0{,}8$?

**Podatki:** $n = 5$, $p = 0{,}8$, $q = 0{,}2$
**Iščemo:** $P(\text{vsaj } 4) = P_5(4) + P_5(5)$

:::formula
$P_n(k) = \binom{n}{k}p^k q^{n-k}$
:::

**Rešitev:**

1. »Vsaj štirikrat« pomeni $k = 4$ ali $k = 5$; členov sta le dva, zato ju seštejemo neposredno.
2. $P_5(4) = 5 \cdot 0{,}8^4 \cdot 0{,}2 = 0{,}4096$.
3. Izračunaj sam $P_5(5)$ in vsoto, nato preveri:

:::premisli
Kolikšna je verjetnost, da Majo sprejmejo?
---
$P_5(5) = 0{,}8^5 = 0{,}32768$, skupaj $0{,}4096 + 0{,}32768 = 0{,}73728$. Sprejmejo jo z verjetnostjo približno $0{,}74$, kar je opazno manj od $0{,}8$.
:::

## Pogoste napake

- **Brez binomskega simbola.** Kdor izračuna samo $0{,}8^2 \cdot 0{,}2 = 0{,}128$, je preštel en potek, na primer $ZZN$. Natanko $k$ uspehov se lahko razporedi na $\binom{n}{k}$ načinov; vse moraš šteti.
- **»Vsaj en« kot $n \cdot p$.** Pri $6$ ugibanjih s $p = \frac{1}{6}$ bi to dalo $1$, torej gotovost, kar ni res. Pri $10$ ugibanjih bi verjetnost presegla $1$. Pravilno: $1 - q^n$.
- **Napačen nasprotni dogodek.** Nasprotje dogodka »vsaj $2$« ni »največ $2$«, ampak »največ $1$«. Napiši si vse $k$ od $0$ do $n$ in prečrtaj tiste, ki jih dogodek zajema.
- **Formula, kjer poskusi niso neodvisni.** Pri izbiranju brez vračanja (trije CD-ji iz škatle, v kateri jih je nekaj poškodovanih) se $p$ spreminja. Tam računaš s kombinacijami, ne z Bernoullijevo formulo.
- **Napačna eksponenta.** $p$ ima eksponent $k$ (število uspehov), $q$ pa $n - k$ (število neuspehov). Vsota eksponentov je vedno $n$.

## Povzetek

- Zaporedje neodvisnih poskusov: isti poskus $n$-krat, dva izida ($A$ ali ne $A$), $P(A) = p$ je vsakič enaka, poskusi so neodvisni; $q = 1 - p$.
- Bernoullijeva formula: $P_n(k) = \binom{n}{k}p^k q^{n-k}$; $\binom{n}{k}$ šteje poteke, $p^k q^{n-k}$ je verjetnost enega poteka.
- »Vsaj en uspeh«: $1 - q^n$. Pri »vsaj« in »največ« izberi krajšo pot: neposredno seštej ali uporabi nasprotni dogodek.
- Vse verjetnosti $P_n(0)$ do $P_n(n)$ so členi razvoja $(q+p)^n$, zato je njihova vsota $1$.
- Pri vlečenju brez vračanja formula ne velja.

## Za maturo

### Naloga 1 (višja raven): krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Lokostrelec zadene tarčo z verjetnostjo $\frac{2}{3}$, izidi strelov so med seboj neodvisni. Na tarčo ustreli $4$-krat.

a) Utemelji, zakaj lahko uporabimo Bernoullijevo formulo, in zapiši $n$, $p$ in $q$. (1 točka)
b) Izračunaj verjetnost, da tarčo zadene natanko dvakrat. (2 točki)
c) Izračunaj verjetnost, da tarčo zadene vsaj enkrat. (2 točki)
d) Izračunaj verjetnost, da tarčo zadene vsaj trikrat. (2 točki)

**Rešitev:**

1. a) Isti poskus (strel) ponovimo $4$-krat, zanima nas le, ali lokostrelec zadene, verjetnost zadetka je vsakič enaka in streli so neodvisni. Zato je $n = 4$, $p = \frac{2}{3}$, $q = 1 - p = \frac{1}{3}$.
2. b) $P_4(2) = \binom{4}{2}\left(\frac{2}{3}\right)^2\left(\frac{1}{3}\right)^2 = 6 \cdot \frac{4}{9} \cdot \frac{1}{9} = \frac{24}{81} = \frac{8}{27}$.
3. c) Nasprotni dogodek je »nobenega zadetka«: $P_4(0) = \left(\frac{1}{3}\right)^4 = \frac{1}{81}$, zato je $P = 1 - \frac{1}{81} = \frac{80}{81}$.
4. d) »Vsaj trikrat« pomeni $k = 3$ ali $k = 4$: $P_4(3) = 4 \cdot \frac{8}{27} \cdot \frac{1}{3} = \frac{32}{81}$ in $P_4(4) = \left(\frac{2}{3}\right)^4 = \frac{16}{81}$.
5. d) $P = \frac{32}{81} + \frac{16}{81} = \frac{48}{81} = \frac{16}{27}$.
6. Odgovor: a) $n = 4$, $p = \frac{2}{3}$, $q = \frac{1}{3}$, b) $\frac{8}{27}$, c) $\frac{80}{81}$, d) $\frac{16}{27}$.

**Točkovanje:** a) 1 točka za utemeljitev (isti poskus, enaka verjetnost, neodvisnost) in $n = 4$, $p = \frac{2}{3}$, $q = \frac{1}{3}$; b) 1 točka za pravilno vstavljeno Bernoullijevo formulo, 1 točka za $\frac{8}{27}$; c) 1 točka za nasprotni dogodek $1 - q^4$, 1 točka za $\frac{80}{81}$; d) 1 točka za $P_4(3) + P_4(4)$ s pravilnima členoma, 1 točka za $\frac{16}{27}$.

### Naloga 2 (višja raven): strukturirana naloga, 10 točk, pola 2 (z računalom)

Stroj izdela izdelek z napako z verjetnostjo $0{,}04$, neodvisno od drugih izdelkov. Izdelke pakirajo v škatle po $20$. Trgovina škatlo vrne, če sta v njej vsaj $2$ izdelka z napako. Rezultate zaokroži na štiri decimalna mesta.

a) Izračunaj verjetnost, da v škatli ni nobenega izdelka z napako. (2 točki)
b) Izračunaj verjetnost, da sta v škatli natanko $2$ izdelka z napako. (2 točki)
c) Izračunaj verjetnost, da trgovina škatlo vrne. (3 točke)
d) Trgovina prejme $5$ škatel. Izračunaj verjetnost, da ne vrne nobene od njih. (3 točke)

**Rešitev:**

1. a) Gre za zaporedje neodvisnih poskusov z $n = 20$; $p = 0{,}04$; $q = 0{,}96$. $P_{20}(0) = 0{,}96^{20} = 0{,}442002\ldots \approx 0{,}4420$.
2. b) $P_{20}(2) = \binom{20}{2} \cdot 0{,}04^2 \cdot 0{,}96^{18} = 190 \cdot 0{,}0016 \cdot 0{,}479603\ldots = 0{,}145799\ldots \approx 0{,}1458$.
3. c) Nasprotni dogodek dogodka »vsaj $2$ izdelka z napako« je »največ $1$ izdelek z napako«. $P_{20}(1) = 20 \cdot 0{,}04 \cdot 0{,}96^{19} = 0{,}368335\ldots$
4. c) $P = 1 - P_{20}(0) - P_{20}(1) = 1 - 0{,}442002\ldots - 0{,}368335\ldots = 0{,}189662\ldots \approx 0{,}1897$.
5. d) Škatla ni vrnjena z verjetnostjo $1 - 0{,}189662\ldots = 0{,}810337\ldots$. Izdelki so med seboj neodvisni, zato so neodvisni tudi dogodki »škatla ni vrnjena« za različne škatle in je $P = (0{,}810337\ldots)^5 = 0{,}349406\ldots \approx 0{,}3494$. (Z zaokroženo vrednostjo $0{,}8103$ dobimo $0{,}3493$, kar je tudi sprejemljivo.)
6. Odgovor: a) $0{,}4420$; b) $0{,}1458$; c) $0{,}1897$; d) $0{,}3494$.

**Točkovanje:** a) 1 točka za $0{,}96^{20}$ (pravilni $n$, $p$, $q$), 1 točka za $0{,}4420$; b) 1 točka za pravilno vstavljeno Bernoullijevo formulo z $\binom{20}{2} = 190$, 1 točka za $0{,}1458$; c) 1 točka za nasprotni dogodek »največ $1$«, 1 točka za vmesni rezultat $P_{20}(1) \approx 0{,}3683$ in 1 točka za $0{,}1897$; d) 1 točka za verjetnost $0{,}8103$, da škatla ni vrnjena, 1 točka za potenco z eksponentom $5$ (produkt neodvisnih dogodkov), 1 točka za $0{,}3494$ (ali $0{,}3493$, če računa z zaokroženo vrednostjo $0{,}8103$).

### Ustno vprašanje 1

:::premisli
(višja raven) Kdaj govorimo o zaporedju neodvisnih poskusov? Naštej pogoje in navedi primer, ki ni tako zaporedje.
---
O zaporedju neodvisnih poskusov govorimo, kadar isti poskus ponovimo $n$-krat. Pri vsaki ponovitvi nas zanima le, ali se dogodek $A$ zgodi ali ne, in verjetnost $P(A) = p$ je vsakič enaka. Poskusi so neodvisni, kar pomeni, da izid enega poskusa ne spremeni verjetnosti pri drugem. Tako zaporedje ni na primer vlečenje kart iz kupa brez vračanja, saj se po vsakem izvlečku sestava kupa in s tem verjetnost spremeni.
:::

### Ustno vprašanje 2

:::premisli
(višja raven) Izpelji Bernoullijevo formulo za verjetnost, da se dogodek v $n$ neodvisnih poskusih zgodi natanko $k$-krat.
---
Dogodek se v enem poskusu zgodi z verjetnostjo $p$ in ne zgodi z verjetnostjo $q = 1 - p$. En potek s $k$ uspehi in $n - k$ neuspehi je produkt neodvisnih dogodkov, zato ima verjetnost $p^k q^{n-k}$, ne glede na to, v katerih poskusih so uspehi. Mesta $k$ uspehov med $n$ poskusi lahko izberemo na $\binom{n}{k}$ načinov, zato je takih potekov $\binom{n}{k}$. Poteki so med seboj nezdružljivi, zato njihove verjetnosti seštejemo in dobimo $P_n(k) = \binom{n}{k}p^k q^{n-k}$.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Utemelji, zakaj je vsota verjetnosti $P_n(0) + P_n(1) + \dots + P_n(n)$ enaka $1$.
---
Verjetnosti $P_n(k) = \binom{n}{k}p^k q^{n-k}$ so natanko členi razvoja potence $(q + p)^n$ po binomskem izreku. Zato je njihova vsota enaka $(q + p)^n$. Ker je $q + p = 1$, je vsota enaka $1^n = 1$. To se ujema s tem, da dogodki »natanko $k$ uspehov« za $k = 0, 1, \dots, n$ zajemajo vse izide in so paroma nezdružljivi.
:::

## Drugače: Z analogijo

Predstavljaj si mešalno mizo s petimi stikali. Vsako stikalo je lahko gor (uspeh) ali dol (neuspeh). Bernoullijeva formula odgovori na dve ločeni vprašanji. Prvo: na koliko načinov lahko postaviš točno štiri stikala gor? To je $\binom{5}{4} = 5$. Drugo: kako verjetna je ena taka postavitev? To je $p^4 q$. Zmnožek obeh je verjetnost, da so gor točno štiri stikala, ne glede na to, katera.

Analogija tudi pokaže, zakaj potrebujemo neodvisnost: če bi bila stikala povezana (dvigneš eno, se dvigne še sosednje), postavitve ne bi bile več enako verjetne.

## Drugače: Bolj natančno

Naj bo $X$ število uspehov v $n$ neodvisnih poskusih. Dogodki $X = 0$, $X = 1$, …, $X = n$ so paroma nezdružljivi in skupaj zajemajo vse izide. Dogodek $X = k$ je vsota $\binom{n}{k}$ nezdružljivih potekov; vsak potek je produkt $n$ neodvisnih dogodkov, $k$ z verjetnostjo $p$ in $n - k$ z verjetnostjo $q$. Od tod

$$P(X = k) = \binom{n}{k}p^k q^{n-k}$$

Po binomskem izreku je $\sum_{k=0}^{n} P(X = k) = (p+q)^n = 1$, kar potrdi, da smo zajeli vse izide. Takemu $X$ pravimo, da je **binomsko porazdeljen**. Najbolj verjetna vrednost leži blizu $n \cdot p$: pri Maji je $5 \cdot 0{,}8 = 4$ in res je $P_5(4) = 0{,}4096$ največja od vseh verjetnosti $P_5(k)$. Več o tem boš srečal pri statistiki.

## Preveri se

? Kateri primer **ni** zaporedje neodvisnih poskusov?
- Kovanec vržemo $10$-krat in štejemo grbe.
~ Met kovanca ne vpliva na naslednjega in $p = \frac{1}{2}$ je vsakič enaka, zato je to zaporedje neodvisnih poskusov.
- Bobnar $8$-krat zaigra isti prehod; vsakič mu uspe z verjetnostjo $0{,}7$.
~ Ista verjetnost in neodvisni poskusi: to je šolski primer Bernoullijevega zaporedja.
+ Iz škatle z $10$ CD-ji, od katerih so $3$ poškodovani, brez vračanja vzamemo $3$ CD-je.
- Kolo sreče z $8$ enakimi polji zavrtimo $5$-krat in štejemo, kolikokrat se ustavi na rdečem polju.
~ Vsako vrtenje je neodvisno, verjetnost rdečega polja pa ostane enaka. To je zaporedje neodvisnih poskusov.
> Brez vračanja se po vsakem vzetem CD-ju spremeni sestava škatle, zato se spremeni tudi verjetnost, da je naslednji poškodovan.

? (brez računala) Verjetnost, da Ana v $5$ poskusih nikoli ne zadene visokega tona, je $0{,}03$. Kolikšna je verjetnost, da ga v $10$ poskusih nikoli ne zadene?
= 0,0009
~ 0,06 | Podvojil si verjetnost. Pri dvakrat več poskusih se potenca $q^n$ kvadrira: $q^{10} = (q^5)^2$.
~ 0,015 | Verjetnost se ne razpolovi, ampak kvadrira: $0{,}03^2$.
> $q^5 = 0{,}03$, zato $q^{10} = (q^5)^2 = 0{,}03^2 = 0{,}0009$. Več poskusov naredi popoln neuspeh mnogo manj verjeten.

? Rok računa, kolikšna je verjetnost vsaj $2$ uspehov v $4$ poskusih, če je $p = 0{,}3$. V katerem koraku je napaka?
| korak | Rokov zapis |
|---|---|
| (1) | nasprotni dogodek je »največ $1$ uspeh« |
| (2) | $P_4(0) = 0{,}7^4 = 0{,}2401$ |
| (3) | $P_4(1) = 0{,}3 \cdot 0{,}7^3 = 0{,}1029$ |
| (4) | $P = 1 - 0{,}2401 - 0{,}1029 = 0{,}657$ |
- V koraku (1).
~ Nasprotje dogodka »vsaj $2$« so izidi $k = 0$ in $k = 1$, torej res »največ $1$«.
- V koraku (2).
~ Nobenega uspeha je natanko en potek, $NNNN$, zato je $0{,}7^4$ pravilno.
+ V koraku (3).
- V koraku (4).
~ Odštevanje je pravilno izvedeno; napačen je že prejšnji rezultat, ki ga korak (4) uporabi.
> Natanko en uspeh je lahko v katerem koli od $4$ poskusov, zato manjka $\binom{4}{1} = 4$: $P_4(1) = 4 \cdot 0{,}1029 = 0{,}4116$ in pravilni rezultat je $1 - 0{,}2401 - 0{,}4116 = 0{,}3483$.

? Razvrsti korake za izračun verjetnosti vsaj enega uspeha v $n$ poskusih.
1. Preveri, da so poskusi neodvisni in je $p$ vsakič enaka.
2. Določi $n$, $p$ in $q = 1 - p$.
3. Zapiši nasprotni dogodek »nobenega uspeha«.
4. Izračunaj $P_n(0) = q^n$.
5. Rezultat odštej od $1$.
> Najprej preveriš, ali formula sploh velja, nato podatke, nasprotni dogodek, njegovo verjetnost in na koncu $1 - q^n$.

? S seznama predvajanja naključno izberemo $4$ skladbe; vsaka je v duru z verjetnostjo $p = 0{,}5$. Na risbi so verjetnosti $P_4(k)$, da je v duru natanko $k$ skladb. Z risbe odčitaj in izračunaj verjetnost, da so vsaj $3$ v duru.
:::risba stolpci
opis: Stolpčni prikaz verjetnosti P₄(k) v odstotkih za p = 0,5. k = 0: 6,25 %; k = 1: 25 %; k = 2: 37,5 %; k = 3: 25 %; k = 4: 6,25 %.
podnapis: Verjetnost k uspehov v 4 poskusih (p = 0,5)
os: verjetnost (%)
korak: 5
stolpec: k = 0 | 6,25
stolpec: k = 1 | 25
stolpec: k = 2 | 37,5
stolpec: k = 3 | 25
stolpec: k = 4 | 6,25
:::
= 0,3125 | 0,0001
~ 0,25 | To je samo $k = 3$. »Vsaj $3$« pomeni še $k = 4$.
~ 0,6875 | To je $k = 2$, $3$ in $4$, torej »vsaj $2$«.
~ 0,0625 | To je samo $k = 4$. Prišteti moraš še $k = 3$.
> »Vsaj $3$« sta stolpca $k = 3$ in $k = 4$: $0{,}25 + 0{,}0625 = 0{,}3125$.

<<RACUN
vrednost: 0.8*0.8*0.2 | 0.128
vrednost: 3*0.8^2*0.2 | 0.384
vrednost: 0.2^3+3*0.8*0.2^2+3*0.8^2*0.2+0.8^3 | 1
vrednost: 0.9^3*0.1 | 0.0729
vrednost: 4*0.9^3*0.1 | 0.2916
vrednost: (5/6)^6 | 0.3349
vrednost: 1-(5/6)^6 | 0.6651
vrednost: 6*(1/6)*(5/6)^5 | 0.4019
vrednost: (5/6)^6+6*(1/6)*(5/6)^5 | 0.7368
vrednost: ln(0.05)/ln(0.7) | 8.40
vrednost: 1-0.7^8 | 0.942
vrednost: 1-0.7^9 | 0.960
vrednost: 5*0.8^4*0.2 | 0.4096
vrednost: 5*0.8^4*0.2+0.8^5 | 0.73728
vrednost: 0.03^2 | 0.0009
vrednost: 1-0.7^4-4*0.3*0.7^3 | 0.3483
vrednost: 6*(2/3)^2*(1/3)^2 | 8/27
vrednost: 1-(1/3)^4 | 80/81
vrednost: 4*(2/3)^3*(1/3) | 32/81
vrednost: 4*(2/3)^3*(1/3)+(2/3)^4 | 16/27
vrednost: 0.96^20 | 0.4420
vrednost: factorial(20)/(factorial(2)*factorial(18)) | 190
vrednost: 0.96^18 | 0.4796
vrednost: 190*0.04^2*0.96^18 | 0.1458
vrednost: 20*0.04*0.96^19 | 0.3683
vrednost: 1-0.96^20-20*0.04*0.96^19 | 0.1897
vrednost: 0.96^20+20*0.04*0.96^19 | 0.8103
vrednost: (0.96^20+20*0.04*0.96^19)^5 | 0.3494
vrednost: 0.8103^5 | 0.3493
>>

:::simboli
P_n | verjetnost $P_n(k)$, da se dogodek v $n$ poskusih zgodi natanko $k$-krat | P_n(k) = \binom{n}{k}p^k q^{n-k} | – |
n | število poskusov | | – |
k | število uspehov | | – | $0 \le k \le n$
p | verjetnost uspeha v enem poskusu | | – | enaka pri vsakem poskusu
q | verjetnost neuspeha v enem poskusu | q = 1 - p | – |
P | verjetnost dogodka | | – |
P_6 | verjetnost $P_6(k)$ za $k$ uganjenih od $6$ odlomkov | P_6(k) = \binom{6}{k}\left(\frac{1}{6}\right)^k\left(\frac{5}{6}\right)^{6-k} | – |
X | število uspehov v $n$ poskusih | | – | binomsko porazdeljena količina
:::
