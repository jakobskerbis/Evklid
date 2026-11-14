---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Odpri notno pesmarico. Pet črt notnega črtovja je vzporednih, osminke pa pogosto povezuje poševna prečka, ki seka črte. Kot med prečko in prvo črto je natanko enak kotu med prečko in peto črto.

Zdaj poglej ksilofon. Vzporedne ploščice so vedno krajše, zato je okvir poševen. Ravna stranica okvira seka vsako ploščico pod istim kotom.

Na videz nimata nič skupnega, skrivata pa isto idejo: **premica, ki seka vzporednice, naredi z vsako od njih enak kot.** Kot zato lahko »potuje« z ene vzporednice na drugo.

Na tekmovanjih je na sliki pogosto znanih le nekaj kotov, iskani pa je daleč stran. Ujamemo ga z **lovljenjem kotov**: iz znanih kotov korak za korakom računamo sosednje. Orodja so tri: koti ob vzporednicah, enakokraki trikotniki in vsote kotov v likih.

## Razlaga

**Rešen primer: znak za naglas.** Skladateljica med vzporedni črti p (zgoraj) in q (spodaj) nariše znak za naglas, podoben znaku »>«. Konica T leži med črtama in kaže desno. Zgornji krak gre od T do točke A na črti p, spodnji do točke B na črti q. Zgornji krak oklepa s črto p kot $35^\circ$ (desno od A, pod črto). Spodnji krak oklepa s črto q kot $48^\circ$ (desno od B, nad črto). Koliko meri kot ATB pri konici?

Trik: skozi T narišemo **pomožno premico** r, vzporedno s p in q. Ta razdeli kot pri konici na dva dela.

- Zgornji del (med TA in r): krak TA seka vzporednici p in r, zato kot pri A »potuje« s p na r: ta del meri $35^\circ$.
- Spodnji del (med r in TB) je iz istega razloga enak kotu pri B, $48^\circ$.
- Kot pri konici je vsota delov: $35^\circ + 48^\circ = 83^\circ$.

:::premisli
Konico T pomaknemo bliže zgornji črti, kota pri A in B pa ostaneta $35^\circ$ in $48^\circ$. Kaj se zgodi s kotom pri konici? Napovej, preden bereš naprej.
---
Ostane $83^\circ$. Pomožno vzporednico lahko narišemo skozi T kjer koli med črtama in kota pri A in B se preneseta nanjo enako. Kot je odvisen le od smeri krakov.
:::

**Posplošitev 1: koti ob vzporednicah.** Kota z vzporednimi kraki sta skladna, če sta oba ostra ali oba topa. Če je en oster in drugi top, sta suplementarna: skupaj dasta $180^\circ$. Če prečka seka črtovje pod $35^\circ$, sta na vsaki črti dva kota po $35^\circ$ in dva po $145^\circ$.

Iz primera dobimo pravilo **ovinka med vzporednicama**: kot pri konici je vsota kotov, ki ju kraka oklepata z vzporednicama na strani konice. Ključ je pomožna vzporednica skozi konico.

V simulaciji spodaj (Koti ob vzporednicah) premikaj drsnik in vrti prečnico. Opazuj, kateri koti so ves čas enaki in kateri vedno skupaj dajo $180^\circ$.

**Posplošitev 2: enakokraki trikotnik.** Najprej številke. V trikotniku ABC je $|AB| = |AC|$, kot pri A meri $40^\circ$. Kota pri B in C sta enaka, ker ležita nasproti enakih stranic. Skupaj merita $180^\circ - 40^\circ = 140^\circ$, vsak torej $70^\circ$.

Splošno: v enakokrakem trikotniku sta enaka kota **ob osnovnici**, nasproti enakih krakov. Velja tudi obratno: enaka kota pomenita enaki stranici. Na tekmovanjih enake daljice niso vedno označene; pogosto sta to dva polmera istega kroga ali dve stranici pravilnega lika.

Podaljšajmo stranico BC čez C. Zunanji kot pri C meri $180^\circ - 70^\circ = 110^\circ$, kar je ravno $40^\circ + 70^\circ$. Tako je vedno: **zunanji kot trikotnika je vsota obeh notranjih kotov, ki nista ob njem.** S tem pravilom prihraniš korak: notranjega kota pri C ni treba računati.

V simulaciji spodaj (Vsota kotov v trikotniku) vleci oglišča in opazuj tri kote, zložene drug ob drugega: vedno sestavijo iztegnjeni kot.

**Posplošitev 3: vsote kotov v likih.** Spet najprej številke. Obe diagonali iz enega oglišča razrežeta petkotnik na $3$ trikotnike, katerih koti skupaj sestavijo notranje kote petkotnika. Vsota je $3 \cdot 180^\circ = 540^\circ$.

Pri $n$-kotniku gre iz enega oglišča $n - 3$ diagonal (ne do sebe in ne do sosedov). Trikotnikov je $n - 2$, zato je vsota notranjih kotov

$$(n - 2) \cdot 180^\circ$$

V pravilnem $n$-kotniku so vsi koti enaki, vsak meri $\dfrac{(n-2) \cdot 180^\circ}{n}$. Zunanji koti (vsak je sokot notranjega) dajo pri vsakem konveksnem liku skupaj $360^\circ$: ko obhodiš lik, se obrneš natanko enkrat okoli sebe.

| $n$ | vsota notranjih | notranji kot pravilnega | zunanji kot pravilnega |
|---|---|---|---|
| $3$ | $180^\circ$ | $60^\circ$ | $120^\circ$ |
| $4$ | $360^\circ$ | $90^\circ$ | $90^\circ$ |
| $5$ | $540^\circ$ | $108^\circ$ | $72^\circ$ |
| $6$ | $720^\circ$ | $120^\circ$ | $60^\circ$ |

:::premisli
Petkotnik lahko razrežemo tudi drugače: iz točke v notranjosti potegnemo daljice do vseh petih oglišč in dobimo $5$ trikotnikov. Zakaj vsota notranjih kotov kljub temu ni $5 \cdot 180^\circ$?
---
Koti petih trikotnikov ob notranji točki niso koti petkotnika. Skupaj tvorijo poln kot $360^\circ$, ki ga moramo odšteti: $5 \cdot 180^\circ - 360^\circ = 540^\circ$, enako kot prej. Splošno $n \cdot 180^\circ - 360^\circ = (n-2) \cdot 180^\circ$.
:::

**Recept za lovljenje.**

1. Iskani kot označi z $x$, enake kote z isto črko.
2. Vpisuj vse kote, ki jih izračunaš, kar v sliko.
3. Išči enake daljice (enakokraki trikotniki), vzporednice (prenašanje kotov) in zaključene like (vsota kotov).
4. Kadar se zatakne, nariši pomožno vzporednico ali podaljšaj stranico in uporabi zunanji kot.
5. Zapiši enačbo za $x$ in preveri vse vsote.

## Rešeni primeri

### Primer 1 (lažji): krog kvint

Učiteljica glasbe nariše krog kvint: $12$ tonov enakomerno po krožnici, sosednje pa poveže z daljicami. Nastane pravilni dvanajstkotnik. Koliko meri njegov notranji kot? Izračunaj na dva načina.

**Podatki:** pravilni $n$-kotnik, $n = 12$; oglišča ležijo na krožnici
**Iščemo:** notranji kot $\alpha$

:::formula
$\alpha = \dfrac{(n-2) \cdot 180^\circ}{n}$
:::

**Rešitev:**

1. Vsota notranjih kotov: $(12 - 2) \cdot 180^\circ = 1800^\circ$.
2. Vsi koti so enaki: $\alpha = 1800^\circ : 12 = 150^\circ$.
3. Drugi način: središče S krožnice povežemo z dvema sosednjima ogliščema. Dvanajst takih kotov ob S sestavi poln kot, zato vsak meri $360^\circ : 12 = 30^\circ$.
4. Trikotnik iz S in dveh sosednjih oglišč je enakokrak, ker sta stranici iz S polmera. Kota ob osnovnici merita vsak $(180^\circ - 30^\circ) : 2 = 75^\circ$.
5. Ob vsakem oglišču se stikata dva taka kota: $\alpha = 2 \cdot 75^\circ = 150^\circ$.
6. Odgovor: notranji kot pravilnega dvanajstkotnika meri $150^\circ$.

### Primer 2: trapez z dvema enakima stranicama

V trapezu ABCD je AB vzporedna s CD (AB je daljša osnovnica). Stranici AD in DC sta enako dolgi, kot pri A meri $70^\circ$. Koliko merijo koti ACD, CAB in ADC?

**Podatki:** AB vzporedna s CD; $|AD| = |DC|$; $\angle DAB = 70^\circ$
**Iščemo:** $\angle ACD$, $\angle CAB$, $\angle ADC$

:::formula
kota ob kraku trapeza: $\angle DAB + \angle ADC = 180^\circ$; v enakokrakem trikotniku sta kota ob osnovnici enaka
:::

**Rešitev:**

1. Krak AD seka vzporednici AB in CD, zato sta kota pri A in D suplementarna: $\angle ADC = 180^\circ - 70^\circ = 110^\circ$.
2. Trikotnik ACD je enakokrak z vrhom D, ker je $|AD| = |DC|$. Kota ob osnovnici AC sta enaka: $\angle DAC = \angle ACD$.
3. Skupaj merita $180^\circ - 110^\circ = 70^\circ$, vsak torej $35^\circ$. Tako je $\angle ACD = 35^\circ$.
4. Diagonala AC seka vzporednici AB in CD. Kota CAB in ACD sta zato enaka (ležita na različnih straneh diagonale): $\angle CAB = 35^\circ$.
5. Preizkus: $\angle DAC + \angle CAB = 35^\circ + 35^\circ = 70^\circ$, kar je ravno kot pri A.
6. Odgovor: $\angle ACD = 35^\circ$, $\angle CAB = 35^\circ$, $\angle ADC = 110^\circ$; diagonala AC razpolavlja kot pri A.

### Primer 3 (težji): tri enake daljice

V trikotniku ABC je $|AB| = |AC|$. Na stranici AC leži točka D, tako da je $|AD| = |DB| = |BC|$. Koliko meri kot pri A?

**Podatki:** $|AB| = |AC|$; D na AC; $|AD| = |DB| = |BC|$
**Iščemo:** $\angle BAC = x$

:::formula
enakokraki trikotnik: enaka kota ob osnovnici; zunanji kot trikotnika $=$ vsota nesosednjih notranjih; vsota kotov v trikotniku $180^\circ$
:::

**Rešitev:**

1. Označimo $\angle BAC = x$.
2. Trikotnik ABD je enakokrak, ker je $|AD| = |DB|$. Enaka sta kota nasproti enakih stranic, torej pri A in B: $\angle ABD = x$.
3. Kot BDC je zunanji kot trikotnika ABD pri D: $\angle BDC = x + x = 2x$.
4. Trikotnik BCD je enakokrak, ker je $|DB| = |BC|$. Enaka sta kota pri D in C: $\angle BCA = 2x$.
5. Trikotnik ABC je enakokrak, ker je $|AB| = |AC|$: tudi $\angle ABC = 2x$.
6. Vsota kotov v trikotniku ABC: $x + 2x + 2x = 180^\circ$, torej $5x = 180^\circ$ in $x = 36^\circ$.
7. Preizkus: $\angle ABC = 72^\circ$, od tega $\angle ABD = 36^\circ$ in $\angle DBC = 36^\circ$. V trikotniku BCD: $36^\circ + 72^\circ + 72^\circ = 180^\circ$.
8. Odgovor: kot pri A meri $36^\circ$.

### Primer 4 – zdaj ti: obratno vprašanje

Oder za komorni orkester ima obliko pravilnega mnogokotnika. Njegov notranji kot je za $100^\circ$ večji od zunanjega. Koliko oglišč ima oder?

**Podatki:** pravilni $n$-kotnik; notranji kot $=$ zunanji kot $+ 100^\circ$
**Iščemo:** število oglišč $n$

:::formula
notranji kot $+$ zunanji kot $= 180^\circ$; zunanji kot pravilnega $n$-kotnika $= \dfrac{360^\circ}{n}$
:::

**Rešitev:**

1. Zunanji kot označimo z $y$. Notranji je $y + 100^\circ$.
2. Notranji in zunanji kot sta sokota: $(y + 100^\circ) + y = 180^\circ$.
3. Izračunaj $y$, nato iz $y = \dfrac{360^\circ}{n}$ še $n$.

:::premisli
Koliko meri zunanji kot in koliko oglišč ima oder?
---
$2y = 80^\circ$, torej $y = 40^\circ$ in $n = 360^\circ : 40^\circ = 9$. Preizkus: notranji kot je $\dfrac{7 \cdot 180^\circ}{9} = 140^\circ$, kar je res $40^\circ + 100^\circ$. Oder je pravilni devetkotnik.
:::

## Pogoste napake

- **Vzporednice »na oko«.** Črti, ki sta na sliki videti vzporedni, morda nista; tekmovalne slike niso natančne. Kote prenašaj le, če je vzporednost dana ali dokazana.
- **Napačna enaka kota.** Pri $|AD| = |DB|$ marsikdo izenači kot pri D z drugim kotom. Enaka sta kota nasproti enakih stranic, torej pri A in B.
- **Ovinek kot trikotnik.** Kot pri konici znaka »>« ni $180^\circ - (35^\circ + 48^\circ) = 97^\circ$ in ne razlika $48^\circ - 35^\circ = 13^\circ$. Tu ni trikotnika. S pomožno vzporednico se vidi, da je kot vsota: $83^\circ$.
- **Vsota $n \cdot 180^\circ$.** Kdor misli, da ima $n$-kotnik $n$ trikotnikov, dobi za osemkotnik $1440^\circ$. Iz enega oglišča je trikotnikov le $n - 2$, zato je vsota $(8 - 2) \cdot 180^\circ = 1080^\circ$.
- **Zunanji namesto notranjega.** $\dfrac{360^\circ}{n}$ je zunanji kot pravilnega $n$-kotnika. Za petkotnik je to $72^\circ$, notranji kot pa $180^\circ - 72^\circ = 108^\circ$.

## Povzetek

- Premica, ki seka vzporednice, naredi z vsako enake kote: kota z vzporednimi kraki sta skladna (oba ostra ali oba topa) ali suplementarna.
- Ovinek med vzporednicama: kot pri konici je vsota kotov, ki ju kraka oklepata z vzporednicama. Trik: pomožna vzporednica skozi konico.
- Enakokraki trikotnik: enaka sta kota nasproti enakih stranic (ob osnovnici). Enake daljice so pogosto polmeri ali stranice pravilnega lika.
- Zunanji kot trikotnika je vsota obeh nesosednjih notranjih kotov.
- Vsota notranjih kotov $n$-kotnika je $(n - 2) \cdot 180^\circ$; zunanji koti konveksnega lika dajo $360^\circ$.
- Recept: iskani kot označi z $x$, vpisuj kote v sliko, išči vzporednice, enake daljice in like, reši enačbo.

## Drugače: Z analogijo

Kot ob vzporednicah je kot glasbeni interval. Melodija, zaigrana oktavo višje, ohrani vse intervale med toni; spremeni se le mesto na klaviaturi. Tudi kot ob prečnici se z ene vzporednice na drugo prenese nespremenjen. Lovljenje kotov je zato podobno prepisovanju melodije v drugo lego: znani »interval« prestaviš tja, kjer ga potrebuješ.

Za zunanje kote si zamisli godbo na pihala, ki koraka okoli trga. Na vsakem vogalu se obrne za zunanji kot. Ko pride nazaj na začetek, gleda v isto smer kot prej, zato se je obrnila za $360^\circ$, ne glede na obliko trga. Pri pravilnem šestkotniku je vsak obrat $360^\circ : 6 = 60^\circ$.

## Drugače: Bolj natančno

**Zakaj velja pravilo za zunanji kot.** V trikotniku ABC podaljšamo BC čez C in skozi C narišemo vzporednico z AB. Ta razdeli zunanji kot pri C na dva dela: prvi je enak kotu pri A (prečnica AC), drugi kotu pri B (prečnica BC). Zunanji kot je zato $\alpha + \beta$. Ker je zunanji kot sokot notranjega $\gamma$, sledi še $\alpha + \beta + \gamma = 180^\circ$.

**Tekmovalni izziv: konice zvezde.** Nariši petkotnik ABCDE in vseh pet njegovih diagonal; nastane zvezda s konicami A, B, C, D, E. Petkotnik je konveksen, ni pa nujno pravilen. Vsota kotov v petih konicah je vedno $180^\circ$. Skica dokaza: diagonala BE seka AC v točki P in AD v točki Q. Kot pri P v trikotniku APQ je zunanji kot trikotnika PCE, zato je enak vsoti kotov v konicah C in E. Enako je kot pri Q v trikotniku APQ enak vsoti kotov v konicah B in D. Vsota kotov trikotnika APQ je $180^\circ$, torej je tudi vsota vseh petih konic $180^\circ$. Pri pravilni zvezdi meri vsaka konica $36^\circ$.

## Preveri se

? Poševna prečka seka prvo in peto črto notnega črtovja. Kot med prečko in prvo črto (zgoraj desno od presečišča) je enak kotu na enakem mestu ob peti črti. Kako imenujemo tak par kotov?
+ kota z vzporednimi kraki
- sovršna kota
~ Sovršna kota ležita ob istem presečišču dveh premic. Tu sta kota na dveh različnih črtah.
- sokota
~ Sokota imata skupen krak in skupaj dasta $180^\circ$. Ta dva kota sta enaka in ležita na različnih črtah.
- komplementarna kota
~ Komplementarna kota skupaj dasta $90^\circ$. Tu sta kota enaka, ne dopolnjujeta se.
> Kraka sta vzporedna (obe črti) oziroma na isti premici (prečka), oba kota sta ostra, zato sta skladna.

? Uredi pravilne like po velikosti notranjega kota, od najmanjšega do največjega.
- šestkotnik, petkotnik, kvadrat, trikotnik
~ Več oglišč ne pomeni manjših kotov. Z vsakim novim ogliščem vsota zraste za cel $180^\circ$, zato so koti vse večji.
+ trikotnik, kvadrat, petkotnik, šestkotnik
- trikotnik, kvadrat, šestkotnik, petkotnik
~ Morda si primerjal zunanje kote ($60^\circ$ pri šestkotniku, $72^\circ$ pri petkotniku). Notranji kot je sokot zunanjega, zato je vrstni red obraten.
> Notranji koti so $60^\circ$, $90^\circ$, $108^\circ$ in $120^\circ$: z več oglišči se notranji kot veča in se približuje $180^\circ$.

? V znaku »>« med vzporednima črtama oklepa zgornji krak s črto kot $\alpha$, spodnji s spodnjo črto kot $\beta$. Kaj se zgodi s kotom pri konici, če zgornji krak zasučemo tako, da se $\alpha$ poveča za $10^\circ$, $\beta$ pa ostane enak?
- Kot pri konici se zmanjša za $10^\circ$.
~ To bi veljalo, če bi bil kot pri konici $180^\circ - (\alpha + \beta)$, kot v trikotniku. Tu trikotnika ni.
- Kot pri konici ostane enak.
~ Kot pri konici ni stalen; je vsota $\alpha + \beta$ in se spreminja z njima.
+ Kot pri konici se poveča za $10^\circ$.
- Kot pri konici se poveča za $20^\circ$.
~ Spremenil se je le en del vsote, zato se kot poveča le za toliko, kolikor se je povečal $\alpha$.
> Kot pri konici je $\alpha + \beta$. Če se $\alpha$ poveča za $10^\circ$, se za toliko poveča tudi vsota.

? Izdelovalec glasbil upogne kovinsko palico v enakokraki trikotnik. Kot ob vrhu, med enakima krakoma, meri $50^\circ$. Koliko meri kot ob osnovnici?
- $50^\circ$
~ Kot ob vrhu ni enak kotoma ob osnovnici. Enaka sta le kota nasproti enakih krakov.
- $130^\circ$
~ To je $180^\circ - 50^\circ$, vsota obeh kotov ob osnovnici. Razdeliti jo moraš na dva enaka dela.
- $25^\circ$
~ To je polovica kota ob vrhu. Razpoloviti moraš ostanek do $180^\circ$, ne kota ob vrhu.
+ $65^\circ$
> Kota ob osnovnici sta enaka: $(180^\circ - 50^\circ) : 2 = 65^\circ$.

? Koliko je vsota notranjih kotov osemkotnika?
- $1440^\circ$
~ To je $8 \cdot 180^\circ$, kot da bi bilo trikotnikov toliko kot oglišč. Iz enega oglišča jih dobiš le $6$.
- $360^\circ$
~ $360^\circ$ je vsota zunanjih kotov konveksnega lika, ne notranjih.
- $1260^\circ$
~ To je $7 \cdot 180^\circ$. Trikotnikov iz enega oglišča je $n - 2$, ne $n - 1$.
+ $1080^\circ$
> Iz enega oglišča gre $5$ diagonal, ki osemkotnik razrežejo na $6$ trikotnikov: $(8 - 2) \cdot 180^\circ = 1080^\circ$.

:::simboli
n | število oglišč mnogokotnika | | | vsota notranjih kotov je (n − 2) · 180°
\alpha | notranji kot pravilnega n-kotnika | \alpha = \frac{(n-2) \cdot 180^\circ}{n} | ° | v primeru 1; drugje je α oznaka poljubnega kota
A, B, C, D | oglišča lika | | | v primeru s trapezom AB ∥ CD
:::
