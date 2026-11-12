---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Že stari Grki so opazili, da jantar, podrgnjen z volno, privlači drobne bilke. V 18. stoletju so raziskovalci vedeli več: obstajata dve vrsti elektrike; telesi z isto vrsto se odbijata, telesi z različnima pa privlačita. Nihče pa ni znal povedati, **kako močna** je ta sila in kako hitro slabi z razdaljo. Brez tega elektrika ni bila prava znanost, ampak zbirka zanimivih poskusov.

Francoski inženir Charles-Augustin de Coulomb je pred tem raziskoval, kako se zvija tanka žica. To znanje je uporabil za zelo občutljivo napravo, **torzijsko tehtnico**. Na tanki žici je visela vodoravna paličica z nabito kroglico na koncu. Ko je ob njo postavil drugo nabito kroglico, se je paličica zasukala, iz kota zasuka pa je izračunal silo. Leta 1785 je objavil, kako je sila odvisna od razdalje.

Njegov zakon razloži, zakaj se otroku na trampolinu naježijo lasje in zakaj se balon po drgnjenju ob dres prime stene. Je tudi osnova za vse, kar sledi: električno polje, tok in vezja.

## Razlaga

**1. Dve vrsti naboja.** Podrgni balon ob lase. Balon potem privlači lase. Dva tako podrgnjena balona pa se odbijata. Telo, ki privlači ali odbija druga telesa, je **naelektreno**: ima **električni naboj**.

Naboj je dveh vrst, **pozitiven** in **negativen**:

- enoimenska naboja (oba $+$ ali oba $-$) se **odbijata**,
- raznoimenska naboja ($+$ in $-$) se **privlačita**.

Od kod naboj? Vsak atom ima v jedru pozitivne protone, okoli jedra pa negativne elektrone. Navadno je teh dveh nabojev enako, zato je telo **nevtralno**. Ob drgnjenju preidejo nekateri elektroni z las na balon. Balon ima nato preveč elektronov in je negativen, lasje jih imajo premalo in so pozitivni.

Naboj se ni ustvaril, samo prenesel se je. To je **zakon o ohranitvi naboja**: skupni naboj ostane enak.

Naboj označimo z $e$, enota je **amperska sekunda** ($\mathrm{As}$), ki se imenuje tudi coulomb ($1\,\mathrm{C} = 1\,\mathrm{As}$). Najmanjši naboj, ki ga srečamo v naravi, je **osnovni naboj** $e_0 = 1{,}6 \cdot 10^{-19}\,\mathrm{As}$: proton ima naboj $+e_0$, elektron $-e_0$. Vsak naboj je celo število osnovnih nabojev, $e = N e_0$.

**2. Merjenje sile.** Namesto Coulombovih kroglic vzemimo dve žogici za namizni tenis, prevlečeni z grafitno barvo, ki prevaja elektriko. Obe naelektrimo z enakim nabojem $5{,}0 \cdot 10^{-8}\,\mathrm{As}$ in merimo silo med njima pri različnih razdaljah med središčema:

| $r$ [cm] | $F$ [mN] | $F$ v primerjavi s $10\,\mathrm{cm}$ |
|---|---|---|
| $10$ | $2{,}25$ | $1$ |
| $20$ | $0{,}56$ | $\frac{1}{4}$ |
| $30$ | $0{,}25$ | $\frac{1}{9}$ |

Pri dvakratni razdalji je sila štirikrat manjša, pri trikratni devetkrat. Sila je **obratno sorazmerna s kvadratom razdalje**, tako kot pri gravitacijskem zakonu.

Nato pri $10\,\mathrm{cm}$ podvojimo naboj ene žogice. Sila se podvoji na $4{,}5\,\mathrm{mN}$. Sila je **sorazmerna z vsakim od nabojev**.

:::premisli
Kolikšno silo bi izmerili pri razdalji $40\,\mathrm{cm}$? Napovej iz tabele, ne iz formule.
---
Razdalja je štirikrat večja kot pri $10\,\mathrm{cm}$, zato je sila $4^2 = 16$-krat manjša: $\dfrac{2{,}25}{16} \approx 0{,}14\,\mathrm{mN}$.
:::

**3. Coulombov zakon.** Obe ugotovitvi združimo v eno formulo. Naboja imenujemo **točkasta**, ko sta telesi majhni v primerjavi z razdaljo med njima. Sila med točkastima nabojema $e_1$ in $e_2$ na razdalji $r$ je

$$F = \frac{e_1 e_2}{4\pi\varepsilon_0 r^2}$$

Konstanta $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\mathrm{(As)^2/(N\,m^2)}$ je **influenčna konstanta**. Za račun je priročno, da je $\dfrac{1}{4\pi\varepsilon_0} \approx 9{,}0 \cdot 10^9\,\mathrm{N\,m^2/(As)^2}$. Preverimo prvo vrstico tabele:

$$F = 9{,}0 \cdot 10^9 \cdot \frac{5{,}0 \cdot 10^{-8} \cdot 5{,}0 \cdot 10^{-8}}{0{,}10^2}$$

$$F = 2{,}25 \cdot 10^{-3}\,\mathrm{N}$$

Kaj moraš vedeti o tej sili:

- Deluje vzdolž zveznice obeh nabojev. Pri enoimenskih nabojih je odbojna, pri raznoimenskih privlačna.
- Na oba naboja deluje **enako velika** sila v nasprotnih smereh (tretji Newtonov zakon), tudi če je en naboj veliko večji.
- V formulo vstavljamo velikosti nabojev, smer sile pa določimo iz predznakov posebej.
- Zakon velja za točkasta telesa. Pri enakomerno nabitih kroglah je $r$ razdalja med središčema.

:::risba skica
opis: Zgoraj dve kroglici, obe označeni s plusom; puščici sile F kažeta od kroglic navzven, kroglici se odbijata. Spodaj kroglica s plusom in kroglica z minusom; puščici sile F kažeta druga proti drugi, kroglici se privlačita. Med spodnjima središčema je označena razdalja r.
območje: 0; 0 .. 8; 6
enota: 38
krog: 2; 4,5 | 0,6 | oranžna
napis: 2; 4,5 | + | sredina | debelo
krog: 6; 4,5 | 0,6 | oranžna
napis: 6; 4,5 | + | sredina | debelo
puščica: 1,4; 4,5 -> 0,2; 4,5 | F | nad
puščica: 6,6; 4,5 -> 7,8; 4,5 | F | nad
krog: 2; 1,8 | 0,6 | oranžna
napis: 2; 1,8 | + | sredina | debelo
krog: 6; 1,8 | 0,6 | modra
napis: 6; 1,8 | − | sredina | debelo
puščica: 2,6; 1,8 -> 3,6; 1,8 | F | nad
puščica: 5,4; 1,8 -> 4,4; 1,8 | F | nad
črta: 2; 0,6 -> 6; 0,6 | siva
napis: 4; 0,6 | r | pod
podnapis: Enoimenska naboja se odbijata, raznoimenska se privlačita.
:::

V simulaciji spodaj »Coulombov zakon« postavi dva naboja na neko razdaljo in si zapiši silo. Nato razdaljo podvoji. Opazuj, ali se sila razpolovi ali zmanjša na četrtino, in kaj se zgodi, ko enemu naboju zamenjaš predznak.

**4. Primerjava z gravitacijo.** Coulombov in gravitacijski zakon sta si podobna: oba padata s kvadratom razdalje. Razlike pa so velike. Gravitacija vedno privlači, električna sila lahko tudi odbija. In električna sila je neprimerljivo močnejša: med elektronom in protonom je približno $10^{39}$-krat večja od gravitacijske (Primer 2).

:::premisli
Če je električna sila tako močna, zakaj med tabo in sošolcem v klopi ne čutiš nobene električne sile?
---
Ker sta obe telesi skoraj natanko nevtralni. Vsako ima enako pozitivnega in negativnega naboja, zato se privlačne in odbojne sile med vsemi delci skoraj popolnoma izničijo. Gravitacija se ne more izničiti, ker vedno le privlači, zato pri velikih telesih, kot je Zemlja, prevlada ona.
:::

## Rešeni primeri

### Primer 1: žogici za namizni tenis

Dve žogici za namizni tenis s prevodno prevleko imata naboja $+4{,}0 \cdot 10^{-8}\,\mathrm{As}$ in $-4{,}0 \cdot 10^{-8}\,\mathrm{As}$. Njuni središči sta $6{,}0\,\mathrm{cm}$ narazen. Kolikšna je sila med njima in ali je privlačna ali odbojna?

**Podatki:** $e_1 = 4{,}0 \cdot 10^{-8}\,\mathrm{As}$ (pozitiven), $e_2 = 4{,}0 \cdot 10^{-8}\,\mathrm{As}$ (negativen), $r = 6{,}0\,\mathrm{cm}$, $\dfrac{1}{4\pi\varepsilon_0} = 9{,}0 \cdot 10^9\,\mathrm{N\,m^2/(As)^2}$
**Iščemo:** velikost sile $F$ in njeno smer

:::formula
$F = \dfrac{e_1 e_2}{4\pi\varepsilon_0 r^2}$
:::

**Rešitev:**

1. Razdaljo pretvorimo v metre, ker je konstanta zapisana z metri: $r = 0{,}060\,\mathrm{m}$, $r^2 = 0{,}0036\,\mathrm{m^2}$.
2. Vstavimo velikosti nabojev: $F = 9{,}0 \cdot 10^9 \cdot \dfrac{4{,}0 \cdot 10^{-8} \cdot 4{,}0 \cdot 10^{-8}}{0{,}0036} = 4{,}0 \cdot 10^{-3}\,\mathrm{N}$.
3. Naboja sta raznoimenska, zato je sila privlačna.
4. Odgovor: žogici se privlačita s silo $4{,}0\,\mathrm{mN}$.

### Primer 2: električna in gravitacijska sila v atomu

V vodikovem atomu sta elektron in proton povprečno $5{,}3 \cdot 10^{-11}\,\mathrm{m}$ narazen. Kolikšna je električna sila med njima? Kolikokrat je večja od gravitacijske?

**Podatki:** $e_0 = 1{,}6 \cdot 10^{-19}\,\mathrm{As}$ (naboj protona in elektrona), $r = 5{,}3 \cdot 10^{-11}\,\mathrm{m}$, $m_e = 9{,}1 \cdot 10^{-31}\,\mathrm{kg}$, $m_p = 1{,}67 \cdot 10^{-27}\,\mathrm{kg}$, $G = 6{,}67 \cdot 10^{-11}\,\mathrm{N\,m^2/kg^2}$, $\dfrac{1}{4\pi\varepsilon_0} = 9{,}0 \cdot 10^9\,\mathrm{N\,m^2/(As)^2}$
**Iščemo:** električno silo $F_e$ in razmerje $\dfrac{F_e}{F_g}$

:::formula
$F_e = \dfrac{e_0^2}{4\pi\varepsilon_0 r^2}$, $F_g = G\,\dfrac{m_e m_p}{r^2}$
:::

**Rešitev:**

1. Kvadrat razdalje: $r^2 = (5{,}3 \cdot 10^{-11})^2 = 2{,}809 \cdot 10^{-21}\,\mathrm{m^2}$.
2. Električna sila: $F_e = 9{,}0 \cdot 10^9 \cdot \dfrac{(1{,}6 \cdot 10^{-19})^2}{2{,}809 \cdot 10^{-21}} \approx 8{,}2 \cdot 10^{-8}\,\mathrm{N}$.
3. Gravitacijska sila: $F_g = 6{,}67 \cdot 10^{-11} \cdot \dfrac{9{,}1 \cdot 10^{-31} \cdot 1{,}67 \cdot 10^{-27}}{2{,}809 \cdot 10^{-21}} \approx 3{,}6 \cdot 10^{-47}\,\mathrm{N}$.
4. Razmerje: $\dfrac{F_e}{F_g} \approx \dfrac{8{,}2 \cdot 10^{-8}}{3{,}6 \cdot 10^{-47}} \approx 2{,}3 \cdot 10^{39}$. Razdalja se pri deljenju pokrajša, zato razmerje velja pri vsaki razdalji.
5. Odgovor: električna sila je okoli $8{,}2 \cdot 10^{-8}\,\mathrm{N}$, približno $2{,}3 \cdot 10^{39}$-krat večja od gravitacijske. Atom drži skupaj električna sila.

### Primer 3: koliko elektronov je na balonu?

Navijača pred tekmo podrgneta dva enaka balona ob dres. Balona dobita enaka naboja in se odbijata s silo $0{,}020\,\mathrm{N}$, ko sta njuni središči $30\,\mathrm{cm}$ narazen. Kolikšen je naboj vsakega balona in koliko elektronov je nanj prešlo z dresa?

**Podatki:** $F = 0{,}020\,\mathrm{N}$, $r = 30\,\mathrm{cm}$, $e_1 = e_2 = e$, $e_0 = 1{,}6 \cdot 10^{-19}\,\mathrm{As}$, $\dfrac{1}{4\pi\varepsilon_0} = 9{,}0 \cdot 10^9\,\mathrm{N\,m^2/(As)^2}$
**Iščemo:** naboj $e$ in število elektronov $N$

:::formula
$F = \dfrac{e^2}{4\pi\varepsilon_0 r^2}$, torej $e^2 = 4\pi\varepsilon_0 r^2 F$; nato $N = \dfrac{e}{e_0}$
:::

**Rešitev:**

1. Naboja sta enaka, zato je v števcu $e^2$. Enačbo pomnožimo s $4\pi\varepsilon_0 r^2$, da je neznanka sama.
2. Pretvorimo: $r = 0{,}30\,\mathrm{m}$.
3. $e^2 = \dfrac{0{,}020 \cdot 0{,}30^2}{9{,}0 \cdot 10^9} = 2{,}0 \cdot 10^{-13}\,\mathrm{(As)^2}$. Deljenje z $9{,}0 \cdot 10^9$ je isto kot množenje s $4\pi\varepsilon_0$.
4. Korenimo: $e = \sqrt{2{,}0 \cdot 10^{-13}} \approx 4{,}47 \cdot 10^{-7}\,\mathrm{As}$, zaokroženo $4{,}5 \cdot 10^{-7}\,\mathrm{As}$. Za naslednji korak obdržimo tri mesta.
5. Število elektronov: $N = \dfrac{4{,}47 \cdot 10^{-7}}{1{,}6 \cdot 10^{-19}} \approx 2{,}8 \cdot 10^{12}$.
6. Odgovor: vsak balon ima naboj okoli $4{,}5 \cdot 10^{-7}\,\mathrm{As}$, nanj je prešlo približno $2{,}8 \cdot 10^{12}$ elektronov. Balona sta negativna, dres pozitiven.

### Primer 4: zdaj ti

Žogici iz Primera 1 sta se privlačili s silo $4{,}0\,\mathrm{mN}$ na razdalji $6{,}0\,\mathrm{cm}$. Zdaj eni žogici podvojimo naboj, razdaljo med središčema pa povečamo na $12\,\mathrm{cm}$. Kolikšna je nova sila?

**Podatki:** $F = 4{,}0\,\mathrm{mN}$, $r = 6{,}0\,\mathrm{cm}$, nova razdalja $r' = 12\,\mathrm{cm}$, en naboj se podvoji
**Iščemo:** novo silo $F'$

:::formula
$F = \dfrac{e_1 e_2}{4\pi\varepsilon_0 r^2}$: $F$ je sorazmerna z $e_1$ in obratno sorazmerna z $r^2$
:::

**Rešitev:**

1. Podvojeni naboj podvoji silo (faktor $2$).
2. Razdalja je dvakrat večja, $r^2$ je zato štirikrat večji, sila štirikrat manjša (faktor $\frac{1}{4}$).
3. Zdaj sam pomnoži staro silo z obema faktorjema.

:::premisli
Kolikšna je nova sila $F'$?
---
$F' = 4{,}0\,\mathrm{mN} \cdot 2 \cdot \dfrac{1}{4} = 2{,}0\,\mathrm{mN}$. Pretvarjati v metre ni bilo treba, ker smo primerjali razmerja.
:::

## Pogoste napake

- **Razdalja brez kvadrata.** Kdor misli, da je pri dvakratni razdalji sila pol manjša, je pozabil na $r^2$. Sila pade na četrtino, pri trikratni razdalji na devetino.
- **Centimetri v formuli.** Če vstaviš $r = 6$ namesto $0{,}06\,\mathrm{m}$, dobiš $10\,000$-krat premajhno silo, ker se razdalja kvadrira. Konstanta $9{,}0 \cdot 10^9$ je zapisana z metri.
- **Predznak naboja v formuli.** Če vstaviš $-4{,}0 \cdot 10^{-8}$, dobiš negativno »silo« in sklepaš, da je manjša. Velikost sile računaj z velikostmi nabojev, smer pa določi iz pravila: enoimenska se odbijata, raznoimenska privlačita.
- **»Večji naboj potisne močneje.«** Napačno je misliti, da balon z velikim nabojem deluje na majhno kroglico z večjo silo kot ona nanj. Sili sta enako veliki in nasprotni; kroglica se le bolj premakne, ker je lažja.
- **»Drgnjenje ustvari naboj.«** Ob drgnjenju elektroni le preidejo z enega telesa na drugo. Telesi dobita enako velika naboja nasprotnih predznakov, skupni naboj ostane nič.

## Povzetek

- Naboj je pozitiven ali negativen. Enoimenska naboja se odbijata, raznoimenska privlačita.
- Naboj se ohranja; ob drgnjenju se elektroni le prenesejo. Enota je $\mathrm{As}$ (coulomb), osnovni naboj $e_0 = 1{,}6 \cdot 10^{-19}\,\mathrm{As}$, $e = N e_0$.
- Coulombov zakon: $F = \dfrac{e_1 e_2}{4\pi\varepsilon_0 r^2}$, $\dfrac{1}{4\pi\varepsilon_0} \approx 9{,}0 \cdot 10^9\,\mathrm{N\,m^2/(As)^2}$, $r$ v metrih.
- Dvakrat večja razdalja da štirikrat manjšo silo; dvakrat večji naboj dvakrat večjo silo.
- Sili na oba naboja sta enako veliki in nasprotni. Električna sila je veliko močnejša od gravitacijske, a se med nevtralnimi telesi izniči.

## Drugače: Z analogijo

Predstavljaj si razpršilec barve, ki ga držiš pred steno. Ko si $10\,\mathrm{cm}$ od stene, ista količina barve pade na majhen krog. Ko se odmakneš na $20\,\mathrm{cm}$, se curek razširi na krog z dvakrat večjim polmerom, torej s štirikrat večjo ploščino. Na vsak kvadratni centimeter stene pade le še četrtina barve.

Tako si lahko predstavljaš vpliv naboja: »razliva« se v vse smeri, na dvakrat večji razdalji pa se porazdeli na štirikrat večjo površino. Enako velja za svetlobo reflektorja na igrišču in za glasnost navijačev v daljavi. Vsi ti učinki pojemajo s kvadratom razdalje.

Analogija ne pove, zakaj se naboji privlačijo ali odbijajo. Pomaga le razumeti, od kod kvadrat v imenovalcu.

## Drugače: Bolj natančno

**Sila kot vektor.** Sila deluje vzdolž zveznice nabojev. Če na naboj deluje več drugih nabojev, sile izračunamo vsako posebej in jih seštejemo kot vektorje. Električna sila je **dolgega dosega**: z razdaljo slabi, a nikoli ne izgine povsem.

**Snov med naboji.** Formula velja za naboje v praznem prostoru, v zraku skoraj enako. V vodi je sila med naboji okoli $80$-krat manjša, ker se molekule vode obrnejo proti nabojema in ju delno zasenčijo. Zato voda tako dobro razdira kristale soli na ione.

**Velikost enote.** Naboj $1\,\mathrm{As}$ je ogromen. Dve telesi s tem nabojem bi se na razdalji $1\,\mathrm{m}$ odbijali s silo okoli $9 \cdot 10^9\,\mathrm{N}$, kar je teža skoraj milijona ton. Pri drgnjenju dobijo telesa naboje velikosti nekaj $10^{-8}$ do $10^{-6}\,\mathrm{As}$.

**Oblika zakona.** Coulombov zakon ima isto zgradbo kot gravitacijski, $F = G\,\dfrac{m_1 m_2}{r^2}$. Namesto mas sta naboja, namesto $G$ je $\dfrac{1}{4\pi\varepsilon_0}$. Ker sta naboja lahko različnih predznakov, je sila lahko privlačna ali odbojna.

## Preveri se

? Kroglica A ima naboj $1{,}0 \cdot 10^{-8}\,\mathrm{As}$, kroglica B petkrat večjega, $5{,}0 \cdot 10^{-8}\,\mathrm{As}$. Na katero kroglico deluje večja električna sila?
- Na kroglico A, ker nanjo deluje večji naboj.
~ Sila je odvisna od zmnožka obeh nabojev, ta pa je za obe kroglici isti.
- Na kroglico B, ker ima večji naboj.
~ Večji naboj ne »čuti« večje sile: v formuli nastopata oba naboja skupaj, kot zmnožek.
+ Na obe deluje enako velika sila.
> Sili na naboja sta enako veliki in nasprotno usmerjeni (tretji Newtonov zakon), ne glede na to, kateri naboj je večji.

? Dva naboja po $2{,}0 \cdot 10^{-6}\,\mathrm{As}$ sta $20\,\mathrm{cm}$ narazen. Kolikšna je sila med njima?
- $0{,}18\,\mathrm{N}$
~ Tako dobiš, če razdalje ne kvadriraš. V imenovalcu je $r^2$.
+ $0{,}90\,\mathrm{N}$
- $9{,}0 \cdot 10^{-5}\,\mathrm{N}$
~ Tako dobiš, če vstaviš $r = 20$ namesto $0{,}20\,\mathrm{m}$.
> $F = 9{,}0 \cdot 10^9 \cdot \dfrac{2{,}0 \cdot 10^{-6} \cdot 2{,}0 \cdot 10^{-6}}{0{,}20^2} = 0{,}90\,\mathrm{N}$.

? Razdaljo med nabojema potrojimo. Kaj se zgodi s silo?
- Zmanjša se na tretjino.
~ Tako bi bilo, če bi bila sila obratno sorazmerna z $r$. Odvisna je od $r^2$.
+ Zmanjša se na devetino.
- Poveča se devetkrat.
~ Faktor $9$ je pravi, smer pa ne: z razdaljo sila slabi.
> Sila je obratno sorazmerna z $r^2$: $3^2 = 9$, zato je sila devetkrat manjša.

? Nik računa silo med nabojema $1{,}0 \cdot 10^{-6}\,\mathrm{As}$ in $4{,}0 \cdot 10^{-6}\,\mathrm{As}$ na razdalji $3{,}0\,\mathrm{cm}$. Korak 1: $r = 0{,}030\,\mathrm{m}$. Korak 2: $F = 9{,}0 \cdot 10^9 \cdot \dfrac{4{,}0 \cdot 10^{-12}}{0{,}030} = 1{,}2\,\mathrm{N}$. Korak 3: naboja sta enoimenska, zato je sila odbojna. Sošolec dobi drugačen rezultat. V katerem koraku se je Nik zmotil?
- Korak 1
~ Pretvorba $3{,}0\,\mathrm{cm} = 0{,}030\,\mathrm{m}$ je pravilna.
+ Korak 2
- Korak 3
~ Oba naboja sta pozitivna, zato je sila res odbojna.
- Noben
~ Napaka je v imenovalcu: razdalja mora biti kvadrirana.
> V imenovalcu manjka kvadrat: $r^2 = 9{,}0 \cdot 10^{-4}\,\mathrm{m^2}$, zato je $F = 9{,}0 \cdot 10^9 \cdot \dfrac{4{,}0 \cdot 10^{-12}}{9{,}0 \cdot 10^{-4}} = 40\,\mathrm{N}$.

? Po skakanju na trampolinu z zaščitno mrežo se Lini lasje naježijo in razprejo. Zakaj?
- Ker jih je med skakanjem zrak potisnil navzgor in tam ostanejo.
~ Zrak potiska lase le med gibanjem; ko Lina obmiruje, bi brez naboja padli nazaj.
+ Ker so se lasje naelektrili z istovrstnim nabojem in se med seboj odbijajo.
- Ker se lasje naelektrijo z nasprotnimi naboji in se privlačijo.
~ Privlačni lasje bi se zlepili skupaj, ne razprli.
- Ker drgnjenje ustvari nov naboj na laseh.
~ Naboj se ne ustvari, elektroni le preidejo med Lino in podlago.
> Pri drgnjenju ob podlago elektroni preidejo med Lino in podlago, naboj pa se razporedi po telesu in laseh. Vsi lasje dobijo naboj istega predznaka, zato se odbijajo in razprejo.

:::simboli
F | velikost električne sile | F = \dfrac{e_1 e_2}{4\pi\varepsilon_0 r^2} | N
e | električni naboj | e = N e_0 | As | tudi coulomb, C
e_1, e_2 | naboja, med katerima deluje sila | | As
r | razdalja med nabojema (središčema) | | m
\varepsilon_0 | influenčna konstanta | | (As)^2/(N\,m^2) | $8{,}85 \cdot 10^{-12}$
\pi | število pi | | – | $3{,}14$
e_0 | osnovni naboj | | As | $1{,}6 \cdot 10^{-19}\,\mathrm{As}$
N | število osnovnih nabojev (presežnih elektronov) | N = \dfrac{e}{e_0} | –
F_e | električna sila med elektronom in protonom | F_e = \dfrac{e_0^2}{4\pi\varepsilon_0 r^2} | N
F_g | gravitacijska sila | F_g = G\,\dfrac{m_e m_p}{r^2} | N
G | gravitacijska konstanta | | N\,m^2/kg^2 | $6{,}67 \cdot 10^{-11}$
m_e | masa elektrona | | kg
m_p | masa protona | | kg
m_1, m_2 | masi teles | | kg
F' | nova sila | | N
r' | nova razdalja | | m
:::
