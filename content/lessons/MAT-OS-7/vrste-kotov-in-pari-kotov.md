---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Kartografinja riše zemljevid novega naselja. Ravna Gozdna cesta tam seka ravno železniško progo. S kotomerom izmeri en sam kot med cesto in progo: $65^\circ$. Ob križišču pa so štirje koti, in na zemljevid zapiše vse štiri. Nobeden ni napačen.

Še bolj čudno je naslednje. Kilometer naprej Gozdno cesto seka Lipova ulica, ki je s progo vzporedna. Tudi tja kartografinja vpiše štiri kote, čeprav tja sploh ni šla merit.

Ugiba? Ne. Koti ob premicah so povezani s strogimi pravili. Kdor jih pozna, iz enega izmerjenega kota izračuna celo mrežo drugih. Tako delajo geodeti, kartografi in navigacijske naprave, ti pa boš s temi pravili reševal naloge s trikotniki in štirikotniki.

## Razlaga

**Najprej rešimo njen primer.** Proga naj bo na zemljevidu vodoravna, cesta pa poteka poševno od spodaj levo proti zgoraj desno. Okoli presečišča nastanejo štirje koti. Izmerjeni kot $\alpha = 65^\circ$ leži zgoraj desno, med progo in cesto.

- Kot $\beta$ zgoraj levo leži ob $\alpha$ na isti strani proge. Skupaj pokrijeta polovico obrata okoli točke, to je $180^\circ$. Zato je $\beta = 180^\circ - 65^\circ = 115^\circ$.
- Kot $\gamma$ spodaj levo leži ob $\beta$ na isti strani ceste. Zato je $\gamma = 180^\circ - 115^\circ = 65^\circ$.
- Kot $\delta$ spodaj desno leži ob $\gamma$, zato je $\delta = 180^\circ - 65^\circ = 115^\circ$.

| kot | lega na zemljevidu | velikost |
|---|---|---|
| $\alpha$ | zgoraj desno | $65^\circ$ |
| $\beta$ | zgoraj levo | $115^\circ$ |
| $\gamma$ | spodaj levo | $65^\circ$ |
| $\delta$ | spodaj desno | $115^\circ$ |

Skupaj dajo $360^\circ$, poln obrat okoli križišča. Iz tega primera zdaj izluščimo splošna pravila.

**Vrste kotov.** Kot sestavljata dva poltraka, ki izhajata iz iste točke. Točki rečemo **teme**, poltrakoma **kraka**. Po velikosti ločimo:

| vrsta | velikost |
|---|---|
| ostri | manj kot $90^\circ$ |
| pravi | $90^\circ$ |
| topi | med $90^\circ$ in $180^\circ$ |
| iztegnjeni | $180^\circ$ (kraka tvorita premico) |
| udrti | med $180^\circ$ in $360^\circ$ |
| polni | $360^\circ$ |

Ob križišču sta torej nastala dva ostra in dva topa kota.

**Sokota.** Kota $\alpha$ in $\beta$ imata skupno teme in skupen krak, njuna druga kraka pa ležita na isti premici. Takemu paru rečemo **sokota**. Skupaj tvorita iztegnjeni kot:

$$\alpha + \beta = 180^\circ$$

Če poznaš enega, drugega dobiš z odštevanjem: $\beta = 180^\circ - \alpha$.

:::premisli
Ali ima lahko topi kot za sokot spet topi kot? Napovej, preden pogledaš.
---
Ne. Dva topa kota sta skupaj več kot $180^\circ$. Sokot topega kota je vedno ostri, sokot pravega kota pa je spet pravi kot.
:::

Ne zamenjaj sokotov s **komplementarnima kotoma**. Komplementarna kota skupaj dasta $90^\circ$, pravi kot, ne iztegnjenega.

**Sovršna kota.** Kota $\alpha$ in $\gamma$ ležita nasproti čez presečišče. Kraka enega sta podaljška krakov drugega. To sta **sovršna kota**. V primeru smo videli, zakaj sta enaka: oba sta sokota istega kota $\beta$, zato oba merita $180^\circ - \beta$. Velja:

$$\alpha = \gamma \qquad \beta = \delta$$

Ob vsakem presečišču dveh premic sta tako dva para sovršnih kotov. Vsak kot pa je sokot obeh sosedov.

**Kota z vzporednimi kraki.** Zdaj še Lipova ulica. Vzporedna je s progo, Gozdna cesta pa je ista. Kot med Lipovo ulico (proti desni) in cesto (proti zgoraj desno) ima krake, vzporedne s kraki kota $\alpha$. Pravimo, da imata kota **vzporedne krake**. Za taka kota velja:

- če sta oba ostra ali oba topa, sta **enaka**;
- če je eden ostri in drugi topi, je njuna vsota $180^\circ$.

Zato tudi na drugem križišču nastaneta dva kota po $65^\circ$ in dva po $115^\circ$. Pri vsaki nalogi s takim parom se najprej vprašaj: sta kota iste vrste ali ne?

:::premisli
Občina Lipovo ulico prestavi še dlje od proge, a ostane vzporedna z njo. Kaj se zgodi s koti na drugem križišču? Zakaj?
---
Nič se ne spremeni. Kraki ostanejo vzporedni s kraki kotov ob progi, razdalja med križiščema pa na velikost kota ne vpliva. Kot pove le, za koliko sta kraka zasukana drug proti drugemu.
:::

V simulaciji spodaj »Pari kotov ob premicah« izberi »Vzporednici in prečnica« in počasi spreminjaj kot $\alpha$. Opazuj: koti, ki so označeni enako, ostanejo enaki na obeh križiščih, en ostri in en topi kot pa skupaj vedno dasta $180^\circ$.

## Rešeni primeri

### Primer 1: odcep planinske poti

Z ravne ceste se odcepi ravna planinska pot. Na zemljevidu izmerimo kot med cesto in potjo: $112^\circ$. Koliko meri drugi kot med cesto in potjo na istem odcepu? Kateri vrsti pripadata kota?

**Podatki:** $\alpha = 112^\circ$; kota imata skupen krak (pot), druga kraka ležita na isti ravni cesti
**Iščemo:** drugi kot $\beta$ in vrsto obeh kotov

:::formula
Sokota: $\alpha + \beta = 180^\circ$, torej $\beta = 180^\circ - \alpha$
:::

**Rešitev:**

1. Kota imata skupen krak, druga kraka pa sta na isti premici, zato sta sokota.
2. $\beta = 180^\circ - 112^\circ = 68^\circ$.
3. $112^\circ$ je med $90^\circ$ in $180^\circ$, zato je topi; $68^\circ$ je manj od $90^\circ$, zato je ostri.
4. Preverimo: $112^\circ + 68^\circ = 180^\circ$.
5. Odgovor: drugi kot meri $68^\circ$. Prvi kot je topi, drugi ostri.

### Primer 2: križišče dveh cest

Na avtokarti se dve ravni cesti sekata. Eden od kotov ob križišču meri $54^\circ$. Koliko merijo ostali trije koti?

**Podatki:** dve premici se sekata, $\alpha = 54^\circ$
**Iščemo:** kote $\beta$, $\gamma$ in $\delta$ (po vrsti okoli križišča)

:::formula
Sovršna kota sta enaka: $\gamma = \alpha$, $\delta = \beta$. Sokota: $\beta = 180^\circ - \alpha$.
:::

**Rešitev:**

1. $\gamma$ leži nasproti $\alpha$, zato je sovršen: $\gamma = 54^\circ$.
2. $\beta$ leži ob $\alpha$ na isti premici, zato je sokot: $\beta = 180^\circ - 54^\circ = 126^\circ$.
3. $\delta$ leži nasproti $\beta$: $\delta = 126^\circ$.
4. Preverimo poln obrat: $54^\circ + 126^\circ + 54^\circ + 126^\circ = 360^\circ$.
5. Odgovor: ostali koti merijo $126^\circ$, $54^\circ$ in $126^\circ$.

### Primer 3: dve vzporedni ulici

Na načrtu mesta avenija seka dve vzporedni ulici. Na prvem križišču sta sosednja kota med avenijo in ulico v razmerju $4 : 5$. Koliko merijo koti na drugem križišču?

**Podatki:** ulici sta vzporedni; sosednja kota na prvem križišču sta v razmerju $4 : 5$
**Iščemo:** vse štiri kote na drugem križišču

:::formula
Sokota: $\alpha + \beta = 180^\circ$. Kota z vzporednimi kraki: iste vrste sta enaka, različnih vrst dasta skupaj $180^\circ$.
:::

**Rešitev:**

1. Sosednja kota ob ulici sta sokota, zato skupaj merita $180^\circ$. Razmerje $4 : 5$ ima $4 + 5 = 9$ delov.
2. En del: $180^\circ : 9 = 20^\circ$.
3. Ostri kot: $\alpha = 4 \cdot 20^\circ = 80^\circ$, topi kot: $\beta = 5 \cdot 20^\circ = 100^\circ$. Preverimo: $80^\circ + 100^\circ = 180^\circ$.
4. Vsak kot na drugem križišču ima vzporedne krake z enim od kotov na prvem. Ostri ustreza ostremu, topi topemu, zato sta enaka.
5. Odgovor: na drugem križišču sta dva kota po $80^\circ$ in dva po $100^\circ$.

### Primer 4: zdaj ti

Na turističnem zemljevidu otoka imata kota $\alpha$ in $\beta$ med dvema paroma vzporednih poti vzporedne krake. Kot $\alpha = 47^\circ$, kot $\beta$ je topi. Koliko meri $\beta$?

**Podatki:** kota imata vzporedne krake, $\alpha = 47^\circ$, $\beta$ je topi
**Iščemo:** kot $\beta$

:::formula
Kota z vzporednimi kraki različnih vrst: $\alpha + \beta = 180^\circ$
:::

**Rešitev:**

1. $\alpha$ je ostri, $\beta$ topi. Kota sta različnih vrst, zato nista enaka.
2. Velja torej $\alpha + \beta = 180^\circ$.
3. Izračunaj sam in preveri vrsto rezultata:

:::premisli
Koliko meri $\beta$?
---
$\beta = 180^\circ - 47^\circ = 133^\circ$. Rezultat je res topi kot, kar se ujema s podatki.
:::

## Pogoste napake

- **Sokot z $90^\circ$ namesto s $180^\circ$.** Učenec za sokot kota $50^\circ$ zapiše $40^\circ$. To je komplementarni kot. Sokota skupaj tvorita premico, zato računaj s $180^\circ$: sokot je $130^\circ$.
- **Sokot s $360^\circ$.** Za sokot kota $123^\circ$ učenec dobi $360^\circ - 123^\circ = 237^\circ$. Do $360^\circ$ se dopolnjujejo vsi štirje koti okoli točke, ne dva. Sokot je $180^\circ - 123^\circ = 57^\circ$.
- **Sovršni kot računamo kot sokot.** Nasproti kota $48^\circ$ ne leži $132^\circ$, ampak spet $48^\circ$. Sovršna kota sta enaka, odšteva se le pri sosednjih kotih.
- **Kota z vzporednimi kraki sta vedno enaka.** Ni res. Enaka sta le, če sta iste vrste. Ostri $70^\circ$ in topi kot z vzporednimi kraki skupaj dasta $180^\circ$, zato topi meri $110^\circ$.
- **Zveza se bere s slike.** Zemljevid ali skica je lahko popačena. Odloči po legi krakov (premica, nasproti, vzporedni kraki), ne po tem, ali kota »izgledata« enako.

## Povzetek

- Vrste kotov: ostri ($<90^\circ$), pravi ($90^\circ$), topi ($90^\circ$ do $180^\circ$), iztegnjeni ($180^\circ$), udrti ($180^\circ$ do $360^\circ$), polni ($360^\circ$).
- **Sokota**: sosednja kota, katerih druga kraka ležita na premici; $\alpha + \beta = 180^\circ$.
- **Sovršna kota**: nasprotna kota ob preseku dveh premic; sta enaka.
- **Kota z vzporednimi kraki**: oba ostra ali oba topa, potem sta enaka. En ostri in en topi, potem je $\alpha + \beta = 180^\circ$.
- Komplementarna kota se dopolnjujeta do $90^\circ$.
- Štirje koti ob presečišču dveh premic dajo skupaj $360^\circ$.

## Drugače: Z analogijo

**Sokota kot polovica pice.** Pico prerežeš čez sredino. Pol pice je iztegnjeni kot, $180^\circ$. Če to polovico prerežeš še enkrat iz središča, dobiš dva kosa. Večji ko je en kos, manjši je drugi, skupaj pa sta vedno pol pice.

**Sovršna kota kot škarje.** Ko škarje odpreš, se rezili razpreta za nek kot. Ročaja se na drugi strani vijaka razpreta za natanko enak kot. Rezili in ročaja sta podaljška drug drugega, prav kot kraka sovršnih kotov.

**Vzporedni kraki kot geotrikotnik na ravnilu.** Geotrikotnik drsi ob ravnilu. Njegov kot se premika po listu, a se ne zasuka, zato ostane enak. To sta kota z vzporednimi kraki iste vrste. Če pa en krak obrneš v nasprotno smer, drugega pa pustiš, dobiš sokot prvotnega kota.

## Drugače: Bolj natančno

**Zakaj sta sovršna kota enaka.** Naj bodo $\alpha$, $\beta$, $\gamma$ trije zaporedni koti ob presečišču dveh premic.

- $\alpha$ in $\beta$ sta sokota: $\alpha + \beta = 180^\circ$.
- $\beta$ in $\gamma$ sta sokota: $\beta + \gamma = 180^\circ$.

Obe vsoti sta enaki, zato je $\alpha + \beta = \beta + \gamma$. Na obeh straneh odštejemo $\beta$ in dobimo $\alpha = \gamma$.

**Natančnejše pravilo za vzporedne krake.** Vsak krak ima smer. Primerjaj smeri istoležnih krakov obeh kotov:

- oba kraka kažeta v isto smer ali oba v nasprotno smer: kota sta enaka;
- en krak kaže v isto, drugi v nasprotno smer: kota skupaj merita $180^\circ$, $\alpha + \beta = 180^\circ$.

Sovršna kota sta poseben primer: oba kraka kažeta v nasprotno smer, zato sta enaka. Pravilo »iste vrste, različnih vrst« je krajša oblika tega pravila. Pri dveh pravih kotih veljata obe zvezi hkrati. Strog dokaz uporablja kote ob vzporednicah, ki jih boš spoznal pozneje.

## Preveri se

? Na zemljevidu se ravna cesta in ravna proga sekata. Kako imenujemo kota, ki ležita drug nasproti drugemu čez križišče?
- sokota
~ Sokota ležita drug ob drugem in imata skupen krak. Nasprotna kota nimata skupnega kraka.
+ sovršna kota
- komplementarna kota
~ Komplementarna kota skupaj dasta $90^\circ$. Pri križišču to ni nujno res.
- iztegnjena kota
~ Iztegnjeni kot meri $180^\circ$, njegova kraka tvorita premico. Kot med cesto in progo, ki se sekata, je manjši.
> Nasprotna kota ob presečišču dveh premic sta sovršna. Kraka enega sta podaljška krakov drugega, zato sta enaka.

? Kot meri $50^\circ$. Uredi po velikosti od najmanjšega: njegov sokot $S$, sovršni kot $V$ in komplementarni kot $K$.
- $V < K < S$
~ Sovršni kot je enak prvotnemu, $50^\circ$, komplementarni pa meri $90^\circ - 50^\circ = 40^\circ$, kar je manj.
+ $K < V < S$
- $K < S < V$
~ Tako uredi, kdor zamenja sokot in sovršni kot. Sovršni kot je enak prvotnemu, $50^\circ$, sokot pa meri $130^\circ$.
- $S < V < K$
~ Sokot s komplementarnim zamenjaš, če sokot računaš z $90^\circ$. Sokot je $130^\circ$, največji od vseh.
> $K = 40^\circ$, $V = 50^\circ$, $S = 130^\circ$. Zato je $K < V < S$.

? Dve ravni cesti se sekata. Kaj se zgodi, če eno cesto zasučemo tako, da se kot $\alpha$ poveča za $10^\circ$?
- Sokot in sovršni kot se oba povečata za $10^\circ$.
~ Sokot se ne more povečati, ker mora skupaj z $\alpha$ ostati $180^\circ$.
+ Sovršni kot se poveča za $10^\circ$, sokot se zmanjša za $10^\circ$.
- Sovršni kot se zmanjša za $10^\circ$, sokot se poveča za $10^\circ$.
~ Tu sta pravili zamenjani. Sovršni kot je vedno enak $\alpha$, zato se spreminja enako kot $\alpha$.
- Oba ostaneta enaka.
~ Vsi štirje koti so odvisni od $\alpha$. Ko se $\alpha$ spremeni, se spremenijo vsi.
> Sovršni kot je vedno enak $\alpha$. Sokot je $180^\circ - \alpha$, zato se zmanjša za toliko, za kolikor se $\alpha$ poveča.

? Kot $\alpha = 123^\circ$. Koliko meri njegov sokot?
- $33^\circ$
~ To je $123^\circ - 90^\circ$: računal si s pravim kotom. Sokota skupaj dasta $180^\circ$.
- $237^\circ$
~ To je $360^\circ - 123^\circ$. Sokota tvorita premico, ne polnega obrata.
+ $57^\circ$
- $123^\circ$
~ Tako velik je sovršni kot. Sokot leži ob kotu na isti premici.
> $180^\circ - 123^\circ = 57^\circ$. Topi kot ima vedno ostri sokot.

? Kota $\alpha$ in $\beta$ imata vzporedne krake. $\alpha = 70^\circ$, $\beta$ je topi. Koliko meri $\beta$?
- $70^\circ$
~ Enaka bi bila le, če bi bila oba ostra. Tu je eden ostri in drugi topi.
- $20^\circ$
~ To je komplementarni kot ($90^\circ - 70^\circ$). Topi kot mora biti večji od $90^\circ$.
+ $110^\circ$
- $290^\circ$
~ To je $360^\circ - 70^\circ$, udrti kot, ne topi.
> Kota sta različnih vrst, zato je $\alpha + \beta = 180^\circ$ in $\beta = 180^\circ - 70^\circ = 110^\circ$.

:::simboli
\alpha | izmerjeni kot (zgoraj desno) | | °
\beta | sokot kota α | \beta = 180^\circ - \alpha | ° | sokota skupaj merita 180°
\gamma | sovršni kot kota α | \gamma = \alpha | ° | sovršna kota sta enaka
\delta | sovršni kot kota β | \delta = \beta | °
:::
