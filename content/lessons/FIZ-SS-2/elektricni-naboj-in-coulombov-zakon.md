---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pleskar pred barvanjem okenskega okvirja nalepi zaščitni lepilni trak. Poskusi nekaj podobnega sam, najbolje s prozornim lepilnim trakom, ker se papirni pleskarski slabo naelektri. Na mizo nalepi dva kosa traka, ju hitro odtrgaj in ju drži za konca drugega ob drugem. Traka se odmakneta. Zdaj en trak nalepi na mizo, drugega na njegov hrbet, oba skupaj odlepi z mize in ju hitro razloči. Ta dva se privlačita.

**Uganka:** zakaj se isti trak enkrat odbija, drugič privlači? Preden bereš naprej, zapiši svojo razlago. Namig: pomisli, kaj se dogaja na stiku, ko trak odtrgaš od podlage.

Raziskovalci 18. stoletja so podobne poskuse poznali. Vedeli so, da se nekatera telesa privlačijo, druga odbijajo. Nekateri so že slutili, da sila slabi s kvadratom razdalje, in so to morda tudi preverjali, a svojih meritev niso objavili. Leta 1785 je francoski inženir Charles-Augustin de Coulomb prvi objavil natančne meritve, opravljene s **torzijsko tehtnico**: nabita kroglica na paličici, obešeni na tanki žici, se je zasukala, ko ji je približal drugo nabito kroglico, iz kota zasuka pa je izračunal silo. Njegov zakon je osnova za električno polje, ki sledi.

## Razlaga

**1. Dve vrsti naboja.** Podrgni balon ob lase. Balon potem privlači lase, dva tako podrgnjena balona pa se odbijata. Telo, ki privlači ali odbija druga telesa, je **naelektreno**: ima **električni naboj**. Naboj je dveh vrst, **pozitiven** in **negativen**:

- enoimenska naboja (oba $+$ ali oba $-$) se **odbijata**,
- raznoimenska naboja ($+$ in $-$) se **privlačita**.

*Hitro preverjanje:* balon, podrgnjen ob lase, je negativen. Trak se od njega odmakne. Kakšen je trak? (Negativen.)

**2. Od kod naboj.** Vsak atom ima v jedru pozitivne protone, okoli jedra pa negativne elektrone. Navadno je obojih nabojev enako, zato je telo **nevtralno**. Ob drgnjenju preidejo nekateri elektroni z las na balon. Balon ima nato preveč elektronov in je negativen, lasje jih imajo premalo in so pozitivni. Naboj se ni ustvaril, samo prenesel se je. To je **zakon o ohranitvi naboja**: skupni naboj ostane enak.

Zdaj lahko rešiš uganko. Traka, odtrgana z mize, dobita naboj iste vrste, zato se odbijata. Ko ločiš zložena trakova, preidejo elektroni z enega na drugega: en postane pozitiven, drugi negativen, zato se privlačita.

Naboj označimo z $e$, enota je **amperska sekunda** ($\mathrm{As}$), ki se imenuje tudi coulomb ($1\,\mathrm{C} = 1\,\mathrm{As}$). Najmanjši naboj, ki ga ima prost delec, je **osnovni naboj** $e_0 = 1{,}6 \cdot 10^{-19}\,\mathrm{As}$: proton ima naboj $+e_0$, elektron $-e_0$. Vsak naboj je celo število osnovnih nabojev, $e = N e_0$.

*Hitro preverjanje:* trak ima naboj $-3{,}2 \cdot 10^{-18}\,\mathrm{As}$. Koliko odvečnih elektronov ima? ($20$.)

**3. Merjenje sile.** Namesto Coulombovih kroglic vzemimo dve žogici za namizni tenis, prevlečeni z grafitno barvo, ki prevaja elektriko. Obe naelektrimo z enakim nabojem $5{,}0 \cdot 10^{-8}\,\mathrm{As}$ in merimo silo pri različnih razdaljah med središčema. Izmerili bi približno tole:

| $r$ [cm] | izmerjena $F$ [mN] | $F$ v primerjavi s $10\,\mathrm{cm}$ |
|---|---|---|
| $10$ | $2{,}24$ | $1$ |
| $20$ | $0{,}57$ | $\approx \frac{1}{4}$ |
| $30$ | $0{,}24$ | $\approx \frac{1}{9}$ |

Meritve imajo majhen raztros, vzorec pa je jasen. Pri dvakratni razdalji je sila štirikrat manjša, pri trikratni devetkrat. Sila je **obratno sorazmerna s kvadratom razdalje**, tako kot pri gravitacijskem zakonu. Kako pa spremenimo naboj, če ga ne znamo izmeriti? Coulombov trik: nabito žogico se dotakni z enako, nenabito žogico. Naboj se razdeli na obe enako, ker sta enaki, zato ima vsaka pol prvotnega. Ko pri $10\,\mathrm{cm}$ eni žogici tako naboj razpolovimo, izmerimo približno pol manjšo silo, $1{,}1\,\mathrm{mN}$; dvakratni naboj bi dal dvakratno silo, $4{,}5\,\mathrm{mN}$. Sila je **sorazmerna z vsakim od nabojev**. Tako je sklepal tudi Coulomb: iz meritev z raztrosom je prepoznal preprosto pravilo.

Krivulja na grafu kaže to pravilo, tri meritve iz tabele (oranžne točke, prva z napisom »meritev«) ležijo skoraj na njej. Točka z napisom F na krivulji je pri $10\,\mathrm{cm}$ in $2{,}25\,\mathrm{mN}$. V aplikaciji premakni drsnik za razdaljo na $20\,\mathrm{cm}$: točka pade na $0{,}56\,\mathrm{mN}$, na četrtino. Pri $30\,\mathrm{cm}$ pade na $0{,}25\,\mathrm{mN}$, na devetino. Opazi, da krivulja pri majhnih $r$ strmo pada, daleč pa se le počasi približuje osi. Nato z drugim drsnikom podvoji naboj: pri $10\,\mathrm{cm}$ dobiš $4{,}50\,\mathrm{mN}$.

:::risba graf
opis: Graf sile F v milinewtonih v odvisnosti od razdalje r v centimetrih med žogicama. Krivulja z razdaljo pada, blizu strmo, daleč počasi. Tri oranžne točke so meritve iz tabele pri 10, 20 in 30 cm. V aplikaciji se z drsnikoma spreminjata razdalja in naboj druge žogice. Izbrano je r = {r} cm, naboj druge žogice je {n}-kratnik prvotnega: sila je {225*n/(r*r):.2} mN.
x: 0 .. 45 | 5 | r (cm)
y: 0 .. 7 | 1 | F (mN)
drsnik: r | 10 .. 40 | 5 | 10 | razdalja r v centimetrih
drsnik: n | 1 .. 3 | 1 | 1 | kolikokrat večji je naboj druge žogice
f: 225*n/x^2 | modra | 10 .. 40
točka: 10; 2,24 | meritev | levo | oranžna
točka: 20; 0,57 | | | oranžna
točka: 30; 0,24 | | | oranžna
točka: r; 225*n/r^2 | F | nad
podnapis: r = {r} cm, naboj {n}-krat: F = {225*n/(r*r):.2} mN
:::

:::premisli
Kolikšno silo bi izmerili pri razdalji $40\,\mathrm{cm}$? Napovej iz tabele, ne iz formule.
---
Razdalja je štirikrat večja kot pri $10\,\mathrm{cm}$, zato je sila $4^2 = 16$-krat manjša: $\dfrac{2{,}24}{16} \approx 0{,}14\,\mathrm{mN}$. V aplikaciji to preveri z drsnikom.
:::

**4. Coulombov zakon.** Obe ugotovitvi združimo v eno formulo. Naboja imenujemo **točkasta**, ko sta telesi majhni v primerjavi z razdaljo med njima. Žogici s premerom $4\,\mathrm{cm}$ sta pri $10\,\mathrm{cm}$ in več še dovolj majhni. Pri žogicah, ki so skoraj v stiku, se naboj prerazporedi, zato formula velja le približno.

Sila med točkastima nabojema $e_1$ in $e_2$ na razdalji $r$ je

$$F = \frac{e_1 e_2}{4\pi\varepsilon_0 r^2}$$

Konstanta $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\mathrm{(As)^2/(N\,m^2)}$ je **influenčna konstanta**. Za račun je priročno, da je $\dfrac{1}{4\pi\varepsilon_0} \approx 9{,}0 \cdot 10^9\,\mathrm{N\,m^2/(As)^2}$. Preverimo prvo vrstico tabele:

$$F = 9{,}0 \cdot 10^9 \cdot \frac{5{,}0 \cdot 10^{-8} \cdot 5{,}0 \cdot 10^{-8}}{0{,}10^2}$$

$$F \approx 2{,}3 \cdot 10^{-3}\,\mathrm{N}$$

Iz tabele: $2{,}24\,\mathrm{mN}$, kar se s formulo ujema.

*Hitro preverjanje:* naboji v prevodniku se lahko prosto premikajo. Bi se prevodni žogici z raznoimenskim nabojem pri $5\,\mathrm{cm}$ privlačili močneje ali šibkeje, kot napove formula z razdaljo med središčema? (Močneje: naboja se pritegneta na bližnji strani žogic, zato sta bližje kot središči.)

Kaj moraš vedeti o tej sili:

- Deluje vzdolž zveznice obeh nabojev. Pri enoimenskih nabojih je odbojna, pri raznoimenskih privlačna (slika spodaj).
- Na oba naboja deluje **enako velika** sila v nasprotnih smereh (tretji Newtonov zakon), tudi če je en naboj veliko večji.
- V formulo vstavljamo velikosti nabojev, smer sile pa določimo iz predznakov posebej.
- Pri enakomerno nabitih kroglah je $r$ razdalja med središčema.

:::risba skica
opis: Zgoraj dve kroglici, obe označeni s plusom; puščici sile F kažeta od kroglic navzven, kroglici se odbijata. Spodaj kroglica s plusom in kroglica z minusom; puščici sile F kažeta druga proti drugi, kroglici se privlačita. Med spodnjima središčema je označena razdalja r. Vse štiri puščice so enako dolge.
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
puščica: 2,6; 1,8 -> 3,8; 1,8 | F | nad
puščica: 5,4; 1,8 -> 4,2; 1,8 | F | nad
črta: 2; 0,6 -> 6; 0,6 | siva
napis: 4; 0,6 | r | pod
podnapis: Enoimenska naboja se odbijata, raznoimenska se privlačita. Sili sta vedno enako veliki.
:::

*Hitro preverjanje:* oba naboja podvojiš, razdalja ostane. Kolikokrat se spremeni sila? (Poveča se štirikrat.)

V aplikaciji je ob lekciji simulacija »Coulombov zakon«. V njej postavi dva naboja na neko razdaljo in si zapiši silo. Nato razdaljo podvoji. Opazuj, ali se sila razpolovi ali zmanjša na četrtino, in kaj se zgodi, ko enemu naboju zamenjaš predznak.

**5. Primerjava z gravitacijo.** Coulombov in gravitacijski zakon padata s kvadratom razdalje, razlike pa so velike. Gravitacija vedno privlači, električna sila lahko tudi odbija. In električna sila je neprimerljivo močnejša: med elektronom in protonom je približno $10^{39}$-krat večja od gravitacijske (Primer 2).

:::premisli
Če je električna sila tako močna, zakaj med tabo in sošolcem v klopi ne čutiš nobene električne sile?
---
Ker sta obe telesi skoraj natanko nevtralni. Vsako ima enako pozitivnega in negativnega naboja, zato se privlačne in odbojne sile med vsemi delci skoraj popolnoma izničijo. Gravitacija se ne more izničiti, ker vedno le privlači, zato pri velikih telesih, kot je Zemlja, prevlada ona.
:::

## Rešeni primeri

### Primer 1: žogici za namizni tenis

Dve žogici za namizni tenis s prevodno prevleko imata naboja $+4{,}0 \cdot 10^{-8}\,\mathrm{As}$ in $-4{,}0 \cdot 10^{-8}\,\mathrm{As}$. Njuni središči sta $12{,}0\,\mathrm{cm}$ narazen. Kolikšna je sila med njima in ali je privlačna ali odbojna?

**Podatki:** $e_1 = 4{,}0 \cdot 10^{-8}\,\mathrm{As}$ (pozitiven), $e_2 = 4{,}0 \cdot 10^{-8}\,\mathrm{As}$ (negativen), $r = 12{,}0\,\mathrm{cm}$, $\dfrac{1}{4\pi\varepsilon_0} = 9{,}0 \cdot 10^9\,\mathrm{N\,m^2/(As)^2}$
**Iščemo:** velikost sile $F$ in njeno smer

:::formula
$F = \dfrac{e_1 e_2}{4\pi\varepsilon_0 r^2}$
:::

**Rešitev:**

1. Žogici s premerom $4\,\mathrm{cm}$ sta majhni v primerjavi z $12\,\mathrm{cm}$, zato ju smemo obravnavati kot točkasta naboja.
2. Razdaljo pretvorimo v metre, ker je konstanta zapisana z metri: $r = 0{,}120\,\mathrm{m}$, $r^2 = 0{,}0144\,\mathrm{m^2}$.
3. Vstavimo velikosti nabojev: $F = 9{,}0 \cdot 10^9 \cdot \dfrac{4{,}0 \cdot 10^{-8} \cdot 4{,}0 \cdot 10^{-8}}{0{,}0144} = 1{,}0 \cdot 10^{-3}\,\mathrm{N}$.
4. Naboja sta raznoimenska, zato je sila privlačna.
5. Odgovor: žogici se privlačita s silo $1{,}0\,\mathrm{mN}$.

### Primer 2: električna in gravitacijska sila v atomu

V vodikovem atomu sta elektron in proton približno $5{,}3 \cdot 10^{-11}\,\mathrm{m}$ narazen (Bohrov polmer). Kolikšna je električna sila med njima? Kolikokrat je večja od gravitacijske?

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

### Primer 3: lebdeča kroglica stiropora

Kdor je lomil ali brusil stiroporne izolacijske plošče, ve, da se drobne kroglice lepijo na roke in orodje: naelektrijo se. Dve enaki kroglici stiropora spustimo v navpično prozorno cevko. Cevka je potrebna, ker bi zgornja kroglica sicer zdrsnila vstran: lebdenje je stabilno le v navpični smeri. Spodnja leži na dnu, zgornja lebdi nad njo, ker ju odbija električna sila. Vsaka ima maso $0{,}30\,\mathrm{mg}$ (toliko tehta kroglica stiropora s premerom okoli $3\,\mathrm{mm}$) in naboj $-2{,}0 \cdot 10^{-10}\,\mathrm{As}$. Kako visoko nad središčem spodnje kroglice je središče zgornje?

**Podatki:** $m = 0{,}30\,\mathrm{mg}$, $e_1 = e_2 = e = 2{,}0 \cdot 10^{-10}\,\mathrm{As}$ (oba negativna), $g = 9{,}8\,\mathrm{m/s^2}$, $\dfrac{1}{4\pi\varepsilon_0} = 9{,}0 \cdot 10^9\,\mathrm{N\,m^2/(As)^2}$
**Iščemo:** razdaljo $r$ med središčema

:::formula
Pogoj za lebdenje (enačba): $\dfrac{e^2}{4\pi\varepsilon_0 r^2} = mg$, od tod $r^2 = \dfrac{e^2}{4\pi\varepsilon_0\, mg}$
:::

**Rešitev:**

1. Maso pretvorimo v kilograme: $m = 0{,}30\,\mathrm{mg} = 3{,}0 \cdot 10^{-7}\,\mathrm{kg}$.
2. Teža zgornje kroglice: $F_g = mg = 3{,}0 \cdot 10^{-7} \cdot 9{,}8 = 2{,}94 \cdot 10^{-6}\,\mathrm{N}$.
3. Kroglica miruje, zato je odbojna električna sila navzgor enako velika kot teža navzdol.
4. Iz pogoja izrazimo $r^2$: $r^2 = \dfrac{9{,}0 \cdot 10^9 \cdot (2{,}0 \cdot 10^{-10})^2}{2{,}94 \cdot 10^{-6}} \approx 1{,}22 \cdot 10^{-4}\,\mathrm{m^2}$.
5. Korenimo: $r \approx 0{,}011\,\mathrm{m}$.
6. Odgovor: središče zgornje kroglice lebdi približno $1{,}1\,\mathrm{cm}$ nad središčem spodnje.

Na grafu sta obe sili na zgornjo kroglico. Električna pada z razdaljo, teža je ves čas $2{,}94\,\mathrm{\mu N}$. Kroglica lebdi tam, kjer se črti sekata, pri $1{,}11\,\mathrm{cm}$. Bližje bi jo električna sila potisnila navzgor, višje bi jo teža povlekla nazaj. V aplikaciji z drsnikom podvoji naboj na $4{,}0 \cdot 10^{-10}\,\mathrm{As}$: presečišče se pomakne na $2{,}21\,\mathrm{cm}$, dvakrat višje. Pri najmanjšem naboju, $1{,}5 \cdot 10^{-10}\,\mathrm{As}$, je presečišče pri $0{,}83\,\mathrm{cm}$; kroglici s premerom $0{,}3\,\mathrm{cm}$ sta tam že precej blizu. Zakaj natanko dvakrat? Sila raste z $e^2$ in pada z $r^2$, zato se ujemata, ko se $r$ poveča toliko kot $e$.

:::risba graf
opis: Graf sil na zgornjo kroglico v mikronewtonih v odvisnosti od razdalje r v centimetrih. Padajoča krivulja je električna sila, vodoravna črtkana črta je teža 2,94 µN. Kroglica lebdi v presečišču. V aplikaciji se z drsnikom spreminja naboj vsake kroglice. Izbrano je {q:.1}·10⁻¹⁰ As: presečišče je pri r = {sqrt(90*q*q/294):.2} cm.
x: 0 .. 3,5 | 0,5 | r (cm)
y: 0 .. 8 | 1 | F (µN)
drsnik: q | 1,5 .. 4 | 0,5 | 2 | naboj vsake kroglice v enotah 10⁻¹⁰ As
f: 0,9*q^2/x^2 | modra | 0,3 .. 3
f: 2,94 | oranžna črtkano
točka: sqrt(90*q*q/294); 2,94
napis: 2,6; 2,94 | teža | nad | oranžna
napis: sqrt(90*q*q/700) + 0,15; 7 | električna sila | desno | modra
podnapis: naboj {q:.1}·10⁻¹⁰ As: kroglica lebdi pri r = {sqrt(90*q*q/294):.2} cm
:::

### Primer 4: zdaj ti

Žogici iz Primera 1 sta se privlačili s silo $1{,}0\,\mathrm{mN}$ na razdalji $12\,\mathrm{cm}$. Zdaj eni žogici podvojimo naboj, razdaljo med središčema pa povečamo na $24\,\mathrm{cm}$. Kolikšna je nova sila?

**Podatki:** $F = 1{,}0\,\mathrm{mN}$, $r = 12\,\mathrm{cm}$, nova razdalja $r' = 24\,\mathrm{cm}$, en naboj se podvoji
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
$F' = 1{,}0\,\mathrm{mN} \cdot 2 \cdot \dfrac{1}{4} = 0{,}50\,\mathrm{mN}$. Pretvarjati v metre ni bilo treba, ker smo primerjali razmerja.
:::

## Pogoste napake

- **Razdalja brez kvadrata.** Kdor misli, da je pri dvakratni razdalji sila pol manjša, je pozabil na $r^2$. Sila pade na četrtino, pri trikratni razdalji na devetino.
- **Centimetri v formuli.** Če vstaviš $r = 12$ namesto $0{,}12\,\mathrm{m}$, dobiš $10\,000$-krat premajhno silo, ker se razdalja kvadrira. Konstanta $9{,}0 \cdot 10^9$ je zapisana z metri.
- **Predznak naboja v formuli.** Če vstaviš $-4{,}0 \cdot 10^{-8}$, dobiš negativno »silo« in sklepaš, da je manjša. Velikost sile računaj z velikostmi nabojev, smer pa določi iz pravila: enoimenska se odbijata, raznoimenska privlačita.
- **»Večji naboj potisne močneje.«** Napačno je misliti, da balon z velikim nabojem deluje na majhno kroglico z večjo silo kot ona nanj. Sili sta enako veliki in nasprotni; kroglica se le bolj premakne, ker je lažja.
- **»Drgnjenje ustvari naboj.«** Ob drgnjenju elektroni le preidejo z enega telesa na drugo. Telesi dobita enako velika naboja nasprotnih predznakov, skupni naboj ostane nič.

## Povzetek

- Naboj je pozitiven ali negativen. Enoimenska naboja se odbijata, raznoimenska privlačita.
- Naboj se ohranja; ob drgnjenju se elektroni le prenesejo. Enota je $\mathrm{As}$ (coulomb), osnovni naboj $e_0 = 1{,}6 \cdot 10^{-19}\,\mathrm{As}$, $e = N e_0$.
- Coulombov zakon: $F = \dfrac{e_1 e_2}{4\pi\varepsilon_0 r^2}$, $\dfrac{1}{4\pi\varepsilon_0} \approx 9{,}0 \cdot 10^9\,\mathrm{N\,m^2/(As)^2}$, $r$ v metrih.
- Dvakrat večja razdalja da štirikrat manjšo silo; dvakrat večji naboj dvakrat večjo silo.
- Sili na oba naboja sta enako veliki in nasprotni. Električna sila je veliko močnejša od gravitacijske, a se med nevtralnimi telesi izniči.

## Drugače: Na sliki

Od kod kvadrat v imenovalcu? Predstavljaj si, da iz naboja v vse smeri izhajajo črte, ki kažejo njegov vpliv. Na sliki jih je osem. Na notranji krožnici je osem črt razporejenih po obsegu $2\pi r$, na zunanji po obsegu $4\pi r$, zato so tam dvakrat redkejše.

:::risba skica
opis: Pozitiven naboj v središču, iz njega izhaja osem črt enakomerno v vse smeri. Okoli naboja sta dve krožnici, notranja s polmerom r in zunanja s polmerom 2r. Iste črte so na zunanji krožnici dvakrat bolj narazen kot na notranji.
območje: -3,6; -3,6 .. 3,6; 3,6
enota: 40
krog: 0; 0 | 1,5 | siva črtkano
krog: 0; 0 | 3 | siva črtkano
puščica: 0,4; 0 -> 3,4; 0
puščica: -0,4; 0 -> -3,4; 0
puščica: 0; 0,4 -> 0; 3,4
puščica: 0; -0,4 -> 0; -3,4
puščica: 0,28; 0,28 -> 2,4; 2,4
puščica: -0,28; 0,28 -> -2,4; 2,4
puščica: 0,28; -0,28 -> 2,4; -2,4
puščica: -0,28; -0,28 -> -2,4; -2,4
krog: 0; 0 | 0,3 | oranžna
napis: 0; 0 | + | sredina | debelo
napis: 1,5; 0 | r | nad desno
napis: 3; 0 | 2r | nad desno
podnapis: Iste črte na dvakrat večji razdalji: v ravnini dvakrat redkejše, v prostoru štirikrat.
:::

V prostoru črte prebadajo kroglo, ne krožnice. Krogla s polmerom $2r$ ima štirikrat večjo površino kot krogla s polmerom $r$, zato pride na vsak kvadratni centimeter le četrtina črt. Tako se vpliv naboja »razredči« s kvadratom razdalje. Enako pojema svetloba majhne žarnice, ko se od nje oddaljuješ.

## Drugače: Bolj natančno

**Sila kot vektor.** Sila deluje vzdolž zveznice nabojev. Če na naboj deluje več drugih nabojev, sile izračunamo vsako posebej in jih seštejemo kot vektorje. Električna sila je **dolgega dosega**: z razdaljo slabi, a nikoli ne izgine povsem.

**Snov med naboji.** Formula velja za naboje v praznem prostoru, v zraku skoraj enako. V vodi je sila med naboji okoli $80$-krat manjša, ker se molekule vode obrnejo proti nabojema in ju delno zasenčijo. Zato voda tako dobro razdira kristale soli na ione.

**Velikost enote.** Naboj $1\,\mathrm{As}$ je ogromen. Dve telesi s tem nabojem bi se na razdalji $1\,\mathrm{m}$ odbijali s silo okoli $9 \cdot 10^9\,\mathrm{N}$, kar je teža skoraj milijona ton. Pri drgnjenju dobijo telesa naboje velikosti nekaj $10^{-8}$ do $10^{-6}\,\mathrm{As}$.

**Deli osnovnega naboja.** Kvarki, iz katerih sta zgrajena proton in nevtron, imajo naboj $\tfrac{1}{3}e_0$ ali $\tfrac{2}{3}e_0$ (s predznakom). Posamič pa jih ne najdemo, zato ima vsak prost delec celo število osnovnih nabojev.

## Preveri se

? Katera trditev je pravilna?
- Ob drgnjenju balona ob lase nastane nov negativen naboj.
~ Naboj se ne ustvari. Elektroni le preidejo z las na balon, skupni naboj ostane enak.
- Večji naboj deluje na manjšega z večjo silo kot manjši nanj.
~ Sili sta po tretjem Newtonovem zakonu enako veliki; v formuli nastopata oba naboja skupaj, kot zmnožek.
+ Če oba naboja podvojiš in tudi razdaljo podvojiš, ostane sila enaka.
- Telo ima lahko naboj $0{,}8 \cdot 10^{-19}\,\mathrm{As}$.
~ To je pol osnovnega naboja. Vsak naboj je celo število osnovnih nabojev $1{,}6 \cdot 10^{-19}\,\mathrm{As}$.
> Zmnožek nabojev se poveča $2 \cdot 2 = 4$-krat, $r^2$ pa tudi $4$-krat, zato se sila ne spremeni. Druge trditve so napačne: naboj se ne ustvari, sili na oba naboja sta enako veliki, naboj pa je celo število osnovnih nabojev.

? Primerjaj sile med pari nabojev. Razvrsti pare od največje do najmanjše sile ($e$ je neki naboj, $r$ neka razdalja).
1. naboja $3e$ in $3e$ na razdalji $r$
2. naboja $4e$ in $e$ na razdalji $r$
3. naboja $4e$ in $4e$ na razdalji $3r$
4. naboja $e$ in $e$ na razdalji $3r$
> Sila je sorazmerna z zmnožkom nabojev in obratno sorazmerna z $r^2$. V primerjavi s parom $e$, $e$ na razdalji $r$ so sile: $9$; $4$; $\frac{16}{9} \approx 1{,}78$ in $\frac{1}{9}$.

? Balon ima po drgnjenju ob lase naboj $-4{,}8 \cdot 10^{-8}\,\mathrm{As}$. Koliko odvečnih elektronov je prejel?
= 3,0·10^11 | 0,1·10^11
~ 3,3·10^-12 | Delil si v napačni smeri: $N = \dfrac{e}{e_0}$, naboj balona deliš z osnovnim nabojem.
~ 7,7·10^-27 | Naboja si zmnožil. Število elektronov dobiš z deljenjem $N = \dfrac{e}{e_0}$.
> $N = \dfrac{4{,}8 \cdot 10^{-8}}{1{,}6 \cdot 10^{-19}} = 3{,}0 \cdot 10^{11}$ elektronov.

? Naboja $+2{,}0 \cdot 10^{-6}\,\mathrm{As}$ in $-2{,}0 \cdot 10^{-6}\,\mathrm{As}$ sta $20\,\mathrm{cm}$ narazen. Kolikšna je velikost sile med njima?
= 0,90 N | 0,01
~ -0,90 | Vstavil si predznak naboja. Velikost sile je pozitivna; da je sila privlačna, poveš posebej iz predznakov.
~ 0,18 | Razdalje nisi kvadriral. V imenovalcu je $r^2$.
~ 9·10^-5 | Vstavil si $r = 20$ namesto $0{,}20\,\mathrm{m}$.
> $F = 9{,}0 \cdot 10^9 \cdot \dfrac{2{,}0 \cdot 10^{-6} \cdot 2{,}0 \cdot 10^{-6}}{0{,}20^2} = 0{,}90\,\mathrm{N}$. Naboja sta raznoimenska, zato je sila privlačna.

? Graf kaže silo med dvema nabojema v odvisnosti od razdalje. Z grafa odčitaj silo pri $r = 3\,\mathrm{cm}$ in izračunaj, kolikšna je sila pri $r = 12\,\mathrm{cm}$.
:::risba graf
opis: Graf sile F v milinewtonih v odvisnosti od razdalje r v centimetrih med dvema nabojema. Krivulja pada od zgornjega roba proti desni. Vrednosti je treba odčitati z mreže.
x: 0 .. 8 | 1 | r (cm)
y: 0 .. 10 | 1 | F (mN)
f: 36/x^2 | modra | 1,9 .. 7
:::
= 0,25 mN | 0,02
~ 1,0 | Razdalja je štirikrat večja, zato je sila $4^2 = 16$-krat manjša, ne le štirikrat.
> Z grafa: pri $3\,\mathrm{cm}$ je $F = 4\,\mathrm{mN}$. Pri $12\,\mathrm{cm}$ je razdalja štirikrat večja, sila pa $16$-krat manjša: $\dfrac{4}{16} = 0{,}25\,\mathrm{mN}$.

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
+ Ker so se lasje naelektrili z istovrstnim nabojem in se med seboj odbijajo.
- Ker jih je med skakanjem zrak potisnil navzgor in tam ostanejo.
~ Zrak potiska lase le med gibanjem; ko Lina obmiruje, bi brez naboja padli nazaj.
- Ker se lasje naelektrijo z nasprotnimi naboji in se privlačijo.
~ Privlačni lasje bi se zlepili skupaj, ne razprli.
- Ker lasje postanejo nevtralni in jih nič več ne drži skupaj.
~ Nevtralni lasje ne delujejo drug na drugega z električno silo, zato bi ostali, kot so bili.
> Pri drgnjenju ob podlago elektroni preidejo med Lino in podlago, naboj pa se razporedi po telesu in laseh. Vsi lasje dobijo naboj istega predznaka, zato se odbijajo in razprejo.

:::simboli
F | velikost električne sile | F = \dfrac{e_1 e_2}{4\pi\varepsilon_0 r^2} | N
e | električni naboj | e = N e_0 | As | tudi coulomb, C
e_1, e_2 | naboja, med katerima deluje sila | | As
r | razdalja med nabojema (središčema) | | m
\varepsilon_0 | influenčna konstanta | | (As)^2/(N\,m^2) | $8{,}85 \cdot 10^{-12}$
\pi | število pi | | – | $3{,}14$
e_0 | osnovni naboj | | As | $1{,}6 \cdot 10^{-19}$
N | število osnovnih nabojev (odvečnih elektronov) | N = \dfrac{e}{e_0} | – | ne zamenjaj z enoto newton (N)
F_e | električna sila med elektronom in protonom | F_e = \dfrac{e_0^2}{4\pi\varepsilon_0 r^2} | N
F_g | gravitacijska sila (v Primeru 3 teža kroglice) | | N
G | gravitacijska konstanta | | N\,m^2/kg^2 | $6{,}67 \cdot 10^{-11}$
m_e | masa elektrona | | kg
m_p | masa protona | | kg
m | masa kroglice | | kg
g | težni pospešek | | m/s^2 | $9{,}8$
F' | nova sila | | N
r' | nova razdalja | | m
:::

<<RACUN
vrednost: 9*10^9*(5*10^-8)^2/0.10^2 | 0.00225
vrednost: 9*10^9*(5*10^-8)^2/0.20^2 | 0.00056
vrednost: 2.24/16 | 0.14
vrednost: 225/30^2 | 0.25
vrednost: 3.2*10^-18/(1.6*10^-19) | 20
vrednost: 9*10^9*(4*10^-8)^2/0.120^2 | 0.0010
vrednost: 4.8*10^-8/(1.6*10^-19) | 3.0*10^11
vrednost: 1.6*10^-19/(4.8*10^-8) | 3.3*10^-12
vrednost: 4.8*10^-8*1.6*10^-19 | 7.7*10^-27
vrednost: 9*10^9*(1.6*10^-19)^2/(5.3*10^-11)^2 | 8.2*10^-8
vrednost: 6.67*10^-11*9.1*10^-31*1.67*10^-27/(5.3*10^-11)^2 | 3.6*10^-47
vrednost: 8.2*10^-8/(3.6*10^-47) | 2.3*10^39
vrednost: 3.0*10^-7*9.8 | 2.94*10^-6
vrednost: 9*10^9*(2.0*10^-10)^2/(2.94*10^-6) | 1.22*10^-4
vrednost: sqrt(9*10^9*(2.0*10^-10)^2/(2.94*10^-6)) | 0.011
vrednost: 2*sqrt(9*10^9*(2.0*10^-10)^2/(2.94*10^-6))*100 | 2.21
vrednost: sqrt(90*1.5^2/294) | 0.83
vrednost: 225/10^2/2 | 1.1
vrednost: 1.0*2/4 | 0.50
vrednost: 16/9 | 1.78
vrednost: 9*10^9*(2*10^-6)^2/0.20^2 | 0.90
vrednost: 4/16 | 0.25
vrednost: 9*10^9*1*10^-6*4*10^-6/0.030^2 | 40
>>
