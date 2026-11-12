---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na blagajni dobiš vrečko z nalepko trgovine: trikoten logotip s stranicami $3\,\text{cm}$, $4\,\text{cm}$ in $5\,\text{cm}$. Ko prideš ven, isti logotip zagledaš na velikem plakatu v izložbi. Plakat je mnogo večji, pa vendar takoj veš, da je to »isti« znak.

V trgovini z gradbenim materialom prodajajo kovinske trikotne nosilce za police v dveh velikostih. Prodajalec reče: »Veliki je enak kot mali, le večji.« Polica na njem stoji enako vodoravno kot na malem.

Nalepka in nosilec sta si na videz zelo različna, a skrivata isto misel: **enaka oblika, različna velikost**. Kako to preverimo z ravnilom? Koliko stane okvir za plakat, če poznamo samo nalepko? Kako izmeriš višino stebra, ne da bi splezal nanj? Odgovor na vsa tri vprašanja je **podobnost** trikotnikov.

## Razlaga

**1. Slika.** Grafik je logotip z nalepke natisnil še na letak, dvakrat večji.

:::risba skica
opis: Dva pravokotna trikotnika. Levo nalepka s katetama 4 cm in 3 cm ter hipotenuzo 5 cm. Desno letak s katetama 8 cm in 6 cm ter hipotenuzo 10 cm. Oba imata pravi kot spodaj levo in enako nagnjeno hipotenuzo.
območje: 0; 0 .. 17; 8,5
enota: 18
lik: 1,5; 1 -> 5,5; 1 -> 1,5; 4 | modra zaprto
pravikot: 1,5; 1 | 5,5; 1 | 1,5; 4
napis: 3,5; 1 | 4 cm | pod
napis: 1,5; 2,5 | 3 cm | levo
napis: 3,5; 2,5 | 5 cm | nad desno
napis: 3,5; 5 | nalepka | sredina
lik: 8; 1 -> 16; 1 -> 8; 7 | oranžna zaprto
pravikot: 8; 1 | 16; 1 | 8; 7
napis: 12; 1 | 8 cm | pod
napis: 8; 4 | 6 cm | levo
napis: 12; 4 | 10 cm | nad desno
napis: 12; 8 | letak | sredina
podnapis: Letak je nalepka, povečana z razmerjem 2.
:::

Pravi kot je ostal pravi. Hipotenuza je na obeh slikah nagnjena enako; s kotomerom izmeriš, da sta enaka tudi ostala kota.

**2. Tabela.** Stranice uredimo po velikosti in jih primerjamo po vrsti:

| stranica | nalepka | letak | letak : nalepka |
|---|---|---|---|
| najkrajša | $3\,\text{cm}$ | $6\,\text{cm}$ | $2$ |
| srednja | $4\,\text{cm}$ | $8\,\text{cm}$ | $2$ |
| najdaljša | $5\,\text{cm}$ | $10\,\text{cm}$ | $2$ |

Vse stranice so se pomnožile z **istim številom**. Kote povečava ohrani, dolžine pa pomnoži.

:::premisli
Drugi grafik bi logotip »povečal« tako, da bi vsaki stranici prištel $3\,\text{cm}$: dobil bi $6\,\text{cm}$, $7\,\text{cm}$ in $8\,\text{cm}$. Bi bil to še isti znak? Zakaj?
---
Ne bi bil. Razmerja $\dfrac{6}{3} = 2$, $\dfrac{7}{4} = 1{,}75$ in $\dfrac{8}{5} = 1{,}6$ niso enaka, zato se oblika spremeni. Tak trikotnik nima niti pravega kota, saj je $6^2 + 7^2 = 85$, $8^2$ pa je $64$.
:::

**3. Podobna trikotnika.** **Ustrezna** sta dela, ki si pri povečavi pripadata, kot pravi kot nalepke in pravi kot letaka. Oznaka s črtico ($a'$, $\alpha'$) pomeni ustrezni del drugega trikotnika. Trikotnika $ABC$ in $A'B'C'$ sta **podobna**, zapišemo $\triangle ABC \sim \triangle A'B'C'$, če veljata obe lastnosti:

- ustrezni koti so skladni: $\alpha = \alpha'$, $\beta = \beta'$, $\gamma = \gamma'$,
- ustrezne stranice so v istem razmerju:

$$\frac{a'}{a} = \frac{b'}{b} = \frac{c'}{c} = k$$

**4. Razmerje podobnosti.** Število $k$ je **razmerje podobnosti**. Pove, s katerim številom pomnožimo vsako stranico prvega trikotnika, da dobimo ustrezno stranico drugega.

- $k > 1$: drugi trikotnik je povečava.
- $k < 1$: drugi trikotnik je pomanjšava.
- $k = 1$: trikotnika sta skladna.

**5. Ustrezne stranice.** Ustrezni stranici ležita nasproti skladnima kotoma. Najkrajša stranica ustreza najkrajši, najdaljša najdaljši. Zato vedno najprej poišči, kateri koti so enaki, in šele nato primerjaj stranice.

**6. Izreki o podobnosti.** Za podobnost ni treba preveriti vseh treh kotov in vseh treh stranic. Dovolj je eno od naslednjega:

- **KK:** dva para ustreznih kotov sta skladna.
- **SSS:** vsi trije pari ustreznih stranic so v istem razmerju: $\dfrac{a'}{a} = \dfrac{b'}{b} = \dfrac{c'}{c}$.
- **SKS:** dva para ustreznih stranic sta v istem razmerju in kota, ki ju stranici oklepata, sta skladna.
- **SsK:** dva para ustreznih stranic sta v istem razmerju in kota, ki ležita nasproti daljši od teh dveh stranic, sta skladna.

:::premisli
Zakaj pri izreku KK zadoščata dva para kotov? Kaj je s tretjim kotom?
---
Vsota kotov v trikotniku je $180^\circ$, zato je tretji kot $\gamma = 180^\circ - \alpha - \beta$. Če se ujemata dva para kotov, se ujema tudi tretji.
:::

**7. Obseg.** Če je razmerje podobnosti $k$, so v razmerju $k$ vse ustrezne dolžine, torej tudi obsega: $o' = k \cdot o$. Pri nalepki in letaku je $o = 12\,\text{cm}$ in $o' = 24\,\text{cm}$.

Preizkusi še sam: v simulaciji »Podobni trikotniki« premikaj drsnik $k$ med $0{,}5$ in $2$. Opazuj, da je vsaka stranica slike isto število krat daljša od ustrezne stranice prvotnega lika, oblika pa ostane enaka.

## Rešeni primeri

### Primer 1: ali sta trikotnika podobna (SSS)

Logotip na nalepki ima stranice $3\,\text{cm}$, $4\,\text{cm}$ in $5\,\text{cm}$, logotip na plakatu pa $36\,\text{cm}$, $48\,\text{cm}$ in $60\,\text{cm}$. Ali sta trikotnika podobna? Kolikšno je razmerje podobnosti in kolikšna sta obsega?

**Podatki:** nalepka $3\,\text{cm}$, $4\,\text{cm}$, $5\,\text{cm}$; plakat $36\,\text{cm}$, $48\,\text{cm}$, $60\,\text{cm}$
**Iščemo:** ali sta podobna, razmerje $k$, obsega $o$ in $o'$

:::formula
SSS: $\dfrac{a'}{a} = \dfrac{b'}{b} = \dfrac{c'}{c} = k$; obseg $o' = k \cdot o$
:::

**Rešitev:**

1. Stranice uredimo po velikosti in primerjamo pare: najkrajša z najkrajšo, srednja s srednjo, najdaljša z najdaljšo.
2. Razmerja: $\dfrac{36}{3} = 12$, $\dfrac{48}{4} = 12$, $\dfrac{60}{5} = 12$.
3. Vsa tri razmerja so enaka, zato sta trikotnika po izreku SSS podobna, $k = 12$.
4. Obsega: $o = 3 + 4 + 5 = 12\,\text{cm}$ in $o' = 36 + 48 + 60 = 144\,\text{cm}$. Res je $o' = k \cdot o = 12 \cdot 12 = 144$ ✓.
5. Odgovor: trikotnika sta podobna z razmerjem $12$; obsega sta $12\,\text{cm}$ in $144\,\text{cm}$.

### Primer 2: manjkajoče stranice

Trikotnika $ABC$ in $A'B'C'$ sta podobna. Trikotnik $ABC$ ima stranice $a = 4\,\text{cm}$, $b = 6\,\text{cm}$, $c = 8\,\text{cm}$. Pri trikotniku $A'B'C'$ je ustrezna stranica $a' = 10\,\text{cm}$. Izračunaj $b'$ in $c'$.

**Podatki:** $a = 4\,\text{cm}$, $b = 6\,\text{cm}$, $c = 8\,\text{cm}$, $a' = 10\,\text{cm}$, $\triangle ABC \sim \triangle A'B'C'$
**Iščemo:** stranici $b'$ in $c'$

:::formula
$k = \dfrac{a'}{a}$, nato $b' = k \cdot b$ in $c' = k \cdot c$
:::

**Rešitev:**

1. Razmerje podobnosti dobimo iz para, ki ga poznamo v celoti: $k = \dfrac{10}{4} = 2{,}5$.
2. Vse ustrezne stranice so v istem razmerju, zato vsako pomnožimo s $k$: $b' = 2{,}5 \cdot 6 = 15\,\text{cm}$.
3. Enako: $c' = 2{,}5 \cdot 8 = 20\,\text{cm}$.
4. Preizkus: $\dfrac{15}{6} = 2{,}5$ in $\dfrac{20}{8} = 2{,}5$ ✓.
5. Odgovor: $b' = 15\,\text{cm}$ in $c' = 20\,\text{cm}$.

### Primer 3 (težji): svetlobni trak okrog plakata

Trgovina naroči nov plakat z logotipom z nalepke ($3\,\text{cm}$, $4\,\text{cm}$, $5\,\text{cm}$). Najdaljša stranica logotipa na plakatu naj meri $150\,\text{cm}$. Rob logotipa obrobijo s svetlobnim trakom, ki stane $6\,€$ za meter. Koliko stane trak?

**Podatki:** nalepka $a = 3\,\text{cm}$, $b = 4\,\text{cm}$, $c = 5\,\text{cm}$; $c' = 150\,\text{cm}$; cena traku $6\,€$ za $1\,\text{m}$
**Iščemo:** ceno traku za obseg logotipa na plakatu

:::formula
$k = \dfrac{c'}{c}$, $o' = k \cdot o$, cena $=$ dolžina v metrih $\cdot$ cena za meter
:::

**Rešitev:**

1. Najdaljša stranica ustreza najdaljši, zato $k = \dfrac{150}{5} = 30$.
2. Obseg nalepke je $o = 3 + 4 + 5 = 12\,\text{cm}$. Ker se vse dolžine pomnožijo s $k$, je $o' = 30 \cdot 12 = 360\,\text{cm}$.
3. Preizkus po stranicah: $30 \cdot 3 = 90$, $30 \cdot 4 = 120$ in $90 + 120 + 150 = 360$ ✓.
4. Cena je podana za meter, zato pretvorimo: $360\,\text{cm} = 3{,}6\,\text{m}$.
5. Cena: $3{,}6 \cdot 6 = 21{,}6$, torej $21{,}60\,€$.
6. Odgovor: trak stane $21{,}60\,€$.

### Primer 4 – zdaj ti: višina stebra iz sence

Pred trgovino stoji reklamni steber. Lastnik bi rad na vrh obesil zastavo, zato potrebuje njegovo višino. Palica, visoka $1{,}5\,\text{m}$, meče senco, dolgo $2\,\text{m}$. Ob istem času meče steber senco, dolgo $12\,\text{m}$. Kako visok je steber?

**Podatki:** višina palice $h_p = 1{,}5\,\text{m}$, senca palice $s_p = 2\,\text{m}$, senca stebra $s = 12\,\text{m}$
**Iščemo:** višino stebra $h$

:::formula
$\dfrac{h}{h_p} = \dfrac{s}{s_p}$
:::

**Rešitev:**

1. Palica in njena senca tvorita pravokotni trikotnik, steber in njegova senca prav tako. Sončni žarki so vzporedni, zato padejo na tla pod enakim kotom. Trikotnika imata pravi kot in še en enak kot, zato sta po izreku KK podobna.
2. Višina ustreza višini, senca senci. Senca stebra je $\dfrac{12}{2} = 6$-krat daljša od sence palice.
3. Izračunaj višino stebra sam, nato preveri.

:::premisli
Kolikšna je višina stebra $h$?
---
$h = 6 \cdot 1{,}5\,\text{m} = 9\,\text{m}$. Steber je $6$-krat višji od palice, ker je njegova senca $6$-krat daljša.
:::

## Pogoste napake

- **Napačni pari stranic.** Primerjaš stranici, ki si ne ustrezata. Vedno poišči skladne kote ali stranice uredi po velikosti.
- **Obrnjeno razmerje.** Če je $k = \dfrac{a'}{a}$, potem je $a' = k \cdot a$ in $a = \dfrac{a'}{k}$. Preveri smiselnost: povečava mora imeti daljše stranice.
- **Seštevanje namesto množenja.** Če se stranica $5$ poveča na $15$, se vsaka stranica ne podaljša za $10$, ampak se pomnoži s $3$. Prištevanje istega števila spremeni obliko.
- **Premalo preverjeno.** Eno samo ujemajoče se razmerje stranic, enak obseg ali to, da sta oba trikotnika enakokraka, še ne pomeni podobnosti. Pri SSS morajo biti enaka vsa tri razmerja.
- **Obseg kot ploščina.** Obseg se pomnoži s $k$, ne s $k^2$. S $k^2$ se pomnoži ploščina.

## Povzetek

- Trikotnika sta podobna, če imata skladne ustrezne kote in sorazmerne ustrezne stranice: enaka oblika, lahko različna velikost.
- Razmerje podobnosti $k = \dfrac{a'}{a} = \dfrac{b'}{b} = \dfrac{c'}{c}$; $k > 1$ povečava, $k < 1$ pomanjšava, $k = 1$ skladnost.
- Podobnost dokažemo z izreki KK, SSS, SKS, SsK.
- Ustrezne stranice ležijo nasproti skladnih kotov; najkrajša ustreza najkrajši.
- Vse dolžine, tudi obseg, se pomnožijo s $k$; stranicam ne prištevamo istega števila.
- S podobnostjo merimo višine iz sence in računamo velikosti povečav.

## Drugače: Z analogijo

Podobnost je kot fotokopirni stroj, nastavljen na $200\,\%$. Vsaka daljica na kopiji je dvakrat daljša, kotov pa stroj ne spremeni: pravi kot ostane pravi, kot $40^\circ$ ostane $40^\circ$.

Ali kot recept. Če recept za palačinke za $4$ osebe preračunaš za $8$ oseb, podvojiš **vsako** sestavino: moko, mleko in jajca. Palačinke so enake, le več jih je. Če pa vsaki sestavini prišteješ $100\,\text{g}$, se razmerje sestavin pokvari in testo ni več isto. Pri trikotniku je enako: stranice množimo z istim $k$, ne prištevamo jim istega števila.

## Drugače: Iz vsakdanjega življenja

**Zemljevid.** Na zemljevidu z merilom $1 : 100\,000$ je $1\,\text{cm}$ v resnici $100\,000\,\text{cm} = 1\,\text{km}$. Trikotnik, ki ga na zemljevidu narišeš med tremi vasmi, je podoben pravemu trikotniku med vasmi, razmerje podobnosti pa je merilo.

**Senca.** Visoke stvari merimo s senco. Ob istem času so sence vseh predmetov sorazmerne njihovim višinam. Če je tvoja senca dvakrat daljša od tvoje višine, je tudi senca stolpa dvakrat daljša od njegove višine.

**Makete.** Model avtomobila v merilu $1 : 18$ je pomanjšava prave stvari. Vse dolžine so $18$-krat krajše, koti pa so enaki.

## Drugače: Bolj natančno

**Zakaj zadoščata dva kota (KK)?** Ko poznaš dva kota trikotnika, je tretji natanko določen: $\gamma = 180^\circ - \alpha - \beta$. Če imata dva trikotnika enaka dva kota, imata torej enake vse tri. Trikotniki z enakimi koti pa imajo isto obliko, saj je oblika trikotnika določena z njegovimi koti. Razlikujeta se lahko le v velikosti, zato so stranice sorazmerne.

**Zakaj ni dovolj, da se ujemata samo dve razmerji?** Vzemimo trikotnik $4, 6, 8$. Drugi trikotnik ima prvi dve stranici $6$ in $9$, torej v razmerju $1{,}5$. Njegova tretja stranica ni nujno $12$. Lahko je tudi $13$; takrat je $\dfrac{13}{8} = 1{,}625$ in trikotnika nista podobna. Zato izreka SKS in SsK zahtevata še en podatek o kotu.

**Ploščine.** Če sta trikotnika podobna z razmerjem $k$, velja:

- razmerje obsegov je $k$,
- razmerje ploščin je $k^2$.

Primer: pravokotni trikotnik s katetama $3\,\text{cm}$ in $4\,\text{cm}$ ima ploščino $\dfrac{3 \cdot 4}{2} = 6\,\text{cm}^2$. Podoben trikotnik s $k = 2$ ima kateti $6\,\text{cm}$ in $8\,\text{cm}$ in ploščino $\dfrac{6 \cdot 8}{2} = 24\,\text{cm}^2$. Res je $24 = 2^2 \cdot 6$.

## Preveri se

? Trgovina ima dva trikotna nosilca polic, mali in veliki. Pri obeh izmeriš kota $90^\circ$ in $35^\circ$. Kaj lahko zanesljivo sklepaš?
- Nič, ker ne poznamo nobene stranice.
~ Po izreku KK zadoščata dva para skladnih kotov; stranic za podobnost ni treba meriti.
- Nosilca sta skladna.
~ Skladna bi bila le, če bi bili enako veliki ($k = 1$). Enaki koti zagotovijo samo enako obliko.
+ Nosilca sta podobna po izreku KK.
> Tretji kot je pri obeh $180^\circ - 90^\circ - 35^\circ = 55^\circ$. Vsi koti se ujemajo, zato sta trikotnika podobna. Velikost se lahko razlikuje.

? Trikotnik ima stranice $2\,\text{cm}$, $3\,\text{cm}$, $4\,\text{cm}$. Trikotniki $P$ ($4$, $6$, $8$), $Q$ ($1$; $1{,}5$; $2$) in $R$ ($6$, $9$, $12$) so mu podobni. Kako si sledijo po razmerju podobnosti, od najmanjšega do največjega?
- $P$, $Q$, $R$
~ $Q$ ima stranice krajše od prvotnega trikotnika, zato je njegov $k$ manjši od $1$ in mora biti prvi.
- $R$, $P$, $Q$
~ To je vrstni red od največjega do najmanjšega. $R$ je največja povečava.
+ $Q$, $P$, $R$
> Razmerja so $Q$: $\dfrac{1}{2} = 0{,}5$, $P$: $\dfrac{4}{2} = 2$ in $R$: $\dfrac{6}{2} = 3$. $Q$ je pomanjšava, $P$ in $R$ sta povečavi.

? Kaj se zgodi z obsegom trikotnika, če vse njegove stranice pomnožimo s $3$?
- Obseg se poveča za $3\,\text{cm}$.
~ Množenje ni prištevanje: vsaka stranica se potroji, zato se potroji tudi njihova vsota.
- Obseg se poveča $9$-krat.
~ $9 = 3^2$ velja za ploščino. Obseg je vsota dolžin, zato se pomnoži s $k = 3$.
+ Obseg se poveča $3$-krat.
> $o' = 3a + 3b + 3c = 3(a + b + c) = 3 \cdot o$.

? Trikotnika sta podobna. Ustrezni stranici merita $5\,\text{cm}$ in $15\,\text{cm}$. Ena od stranic manjšega trikotnika meri $4\,\text{cm}$. Kolikšna je njena ustrezna stranica v večjem trikotniku?
- $14\,\text{cm}$
~ Tu je stranici prišteta razlika $15 - 5 = 10$. Pri podobnosti stranice množimo s $k$.
- $\dfrac{4}{3}\,\text{cm}$
~ Tu je $4$ deljeno s $k$ namesto pomnoženo. Večji trikotnik mora imeti daljše stranice.
+ $12\,\text{cm}$
> Razmerje podobnosti je $k = \dfrac{15}{5} = 3$, zato je ustrezna stranica $3 \cdot 4 = 12\,\text{cm}$.

? Logotip na nalepki ima obseg $12\,\text{cm}$ in najdaljšo stranico $5\,\text{cm}$. Na plakatu meri najdaljša stranica $100\,\text{cm}$. Okvir okrog logotipa stane $3\,€$ za meter. Koliko stane okvir?
- $720\,€$
~ Obseg $240\,\text{cm}$ je pomnožen s ceno za meter brez pretvorbe v metre.
+ $7{,}20\,€$
- $144\,€$
~ Obseg je pomnožen s $k^2 = 400$, kot pri ploščini. Obseg se pomnoži s $k = 20$.
- $8{,}91\,€$
~ Vsaki stranici je prišteto $95\,\text{cm}$, kot da bi se vse podaljšale za isto dolžino. Stranice se pomnožijo s $k$.
> $k = \dfrac{100}{5} = 20$, $o' = 20 \cdot 12 = 240\,\text{cm} = 2{,}4\,\text{m}$, cena $2{,}4 \cdot 3 = 7{,}2$, torej $7{,}20\,€$.

:::simboli
a, b, c | stranice trikotnika | | cm
\alpha, \beta, \gamma | notranji koti trikotnika | \alpha + \beta + \gamma = 180^\circ | °
\alpha', \beta', \gamma' | ustrezni koti podobnega trikotnika | \alpha' = \alpha | ° | podobna trikotnika imata skladne ustrezne kote
a', b', c' | ustrezne stranice podobnega trikotnika | a' = k \cdot a | cm
k | razmerje podobnosti | k = \frac{a'}{a} | – | $k > 1$ povečava, $k < 1$ pomanjšava
o | obseg prvega trikotnika | o = a + b + c | cm
o' | obseg podobnega trikotnika | o' = k \cdot o | cm
h | višina stebra | h = h_p \cdot \frac{s}{s_p} | m
h_p | višina palice | | m
s | dolžina sence stebra | | m
s_p | dolžina sence palice | | m
:::
