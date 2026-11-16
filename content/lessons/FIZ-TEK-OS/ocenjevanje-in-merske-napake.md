---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

»Desko sem izmeril petkrat in kalkulator je izračunal povprečje $84{,}26\,\mathrm{cm}$. Torej je deska dolga natanko toliko, na stotinko centimetra,« se pohvali Jan pri tehniki. Njegov tesarski meter ima razdelke po milimetru.

Mizarka v delavnici bi se mu nasmehnila. Meter, ki kaže milimetre, ne more izmeriti stotinke centimetra, to je desetinke milimetra, ne glede na to, koliko decimalk izpiše kalkulator. Vsaka meritev ima napako, in kdor ve, kako velika je, ve tudi, ali bo polica šla v nišo. Na tekmovanjih so naloge z oceno, odčitkom in napako pogoste, ker preverijo, ali razumeš številke, ne le, ali jih znaš vtipkati. Na koncu boš znal Janu pokazati, kako se rezultat zapiše pošteno.

## Razlaga

Vrstni red je isti kot v delavnici: najprej oceniš, nato izmeriš, na koncu poveš, koliko meritvi zaupaš. Po vsakem koraku je hiter test z odgovorom v oklepaju.

**1. Ocena.** Preden kupiš vijake za leseno ograjo, ne potrebuješ natančnega števila, ampak dobro **oceno**: približno vrednost, dobljeno z zaokroženimi podatki in preprostim računom. Ograja je dolga okoli $20\,\mathrm{m}$, na vsak meter prideta $2$ deski, vsaka potrebuje $4$ vijake. To je približno $20 \cdot 2 \cdot 4 = 160$ vijakov, torej kupiš paket z $200$ vijaki. Strategija: nalogo razbij na korake, ki jih znaš oceniti, uporabi okrogla števila in rezultat podaj z enim ali dvema mestoma.

**Hiter test.** Paket $500$ listov papirja je debel $5\,\mathrm{cm}$. Kako debel je en list? *(Približno $\dfrac{50\,\mathrm{mm}}{500} = 0{,}1\,\mathrm{mm}$.)*

**2. Odčitek.** Ko meriš z ravnilom, številko **odčitaš** na skali. Najmanjša razdalja med dvema črticama je **najmanjši razdelek** merila. Na spodnji sliki se vijak začne pri ničli, njegova konica pa sega do črtice $3{,}4\,\mathrm{cm}$.

:::risba premica
opis: Ravnilo od 0 do 5 cm z milimetrskimi razdelki. Vijak sega od 0 do 3,4 cm.
od: 0
do: 5
korak: 0,1
oznake: 1
interval: 0 .. 3,4 | vijak
:::

Odčitek je zanesljiv le na en razdelek natančno. Zato zapišemo $l = (3{,}4 \pm 0{,}1)\,\mathrm{cm}$: dolžina je nekje med $3{,}3$ in $3{,}5\,\mathrm{cm}$. Pri odčitavanju glej na skalo pravokotno, sicer se zaradi **paralakse** (navideznega premika pri gledanju postrani) zmotiš za cel razdelek. Preveri tudi, ali predmet res leži na ničli.

**Hiter test.** Zidarska letev ima razdelke po $1\,\mathrm{cm}$, tesarski meter po $1\,\mathrm{mm}$. S katero je napaka odčitka manjša? *(S tesarskim metrom, desetkrat manjša.)*

**3. Več meritev in povprečje.** Polico za nišo izmeriš trikrat in dobiš $60{,}2\,\mathrm{cm}$; $60{,}5\,\mathrm{cm}$ in $60{,}2\,\mathrm{cm}$. Meritve se razlikujejo, ker meter vsakič položiš malo drugače. Najboljši približek prave vrednosti je **povprečje** (oznaka $\bar{x}$, beri »x s črtico«): vsoto vseh $n$ meritev delimo z njihovim številom.

$$\bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n}$$

Za polico: $\bar{x} = \dfrac{60{,}2 + 60{,}5 + 60{,}2}{3}\,\mathrm{cm} = 60{,}3\,\mathrm{cm}$.

**Hiter test.** Ali mora biti povprečje enako eni od meritev? *(Ne. Tu nobena meritev ni $60{,}3\,\mathrm{cm}$.)*

**4. Odstopanje in absolutna napaka.** Vsaka meritev $x_i$ se od povprečja razlikuje za **odstopanje** $|x_i - \bar{x}|$, ki ga vedno štejemo pozitivno. Pri polici so odstopanja $0{,}1\,\mathrm{cm}$; $0{,}2\,\mathrm{cm}$ in $0{,}1\,\mathrm{cm}$. Največje izmed njih je **absolutna napaka** $\Delta x$, tu $\Delta x = 0{,}2\,\mathrm{cm}$. Pove, za koliko se prava vrednost lahko razlikuje od povprečja, navzgor ali navzdol. Pri grafih gibanja je $\Delta$ pomenil spremembo; tukaj $\Delta x$ pomeni napako meritve.

:::premisli
Jan izmeri isto polico trikrat z zidarsko letvijo, ki ima razdelke po $1\,\mathrm{cm}$, in vsakič odčita $60\,\mathrm{cm}$. Vsa odstopanja so nič. Je njegova meritev brez napake?
---
Ne. Meritve so enake samo zato, ker je merilo pregrobo, da bi pokazalo razlike. Kadar so vse meritve enake, za absolutno napako vzamemo najmanjši razdelek: $l = (60 \pm 1)\,\mathrm{cm}$.
:::

**5. Rezultat in relativna napaka.** Rezultat zapišemo kot $x = \bar{x} \pm \Delta x$, za polico $l = (60{,}3 \pm 0{,}2)\,\mathrm{cm}$. Ali je napaka $0{,}2\,\mathrm{cm}$ velika? To je odvisno od tega, kaj meriš. Zato izračunamo še **relativno napako** $\delta$, ki napako primerja z izmerjeno vrednostjo:

$$\delta = \frac{\Delta x}{\bar{x}}$$

Za polico je $\delta = \dfrac{0{,}2\,\mathrm{cm}}{60{,}3\,\mathrm{cm}} \approx 0{,}0033 = 0{,}33\,\%$. Manjša relativna napaka pomeni boljšo meritev.

:::premisli
Z istim tesarskim metrom (napaka $1\,\mathrm{mm}$) izmeriš debelino deske, $2\,\mathrm{cm}$, in njeno dolžino, $2\,\mathrm{m}$. Katera meritev je boljša in kolikokrat?
---
Dolžina. Pri debelini je $\delta = \dfrac{1\,\mathrm{mm}}{20\,\mathrm{mm}} = 5\,\%$, pri dolžini $\delta = \dfrac{1\,\mathrm{mm}}{2000\,\mathrm{mm}} = 0{,}05\,\%$. Ista absolutna napaka je pri stokrat večji količini stokrat manj pomembna.
:::

**6. Koliko decimalk.** Absolutno napako zaokroži na prvo števko, ki ni nič (na primer $0{,}16 \to 0{,}2$ ali $0{,}013 \to 0{,}01$), povprečje pa na isto decimalko kot napako. Decimalke za tem mestom so izmišljene: kalkulator ne ve, kako dober je tvoj meter.

**Hiter test.** Kako zapišeš rezultat, če je $\bar{x} = 12{,}5333\,\mathrm{cm}$ in $\Delta x = 0{,}13\,\mathrm{cm}$? *($(12{,}5 \pm 0{,}1)\,\mathrm{cm}$.)*

## Rešeni primeri

### Primer 1: Janova deska

Jan je desko izmeril petkrat: $84{,}2\,\mathrm{cm}$; $84{,}4\,\mathrm{cm}$; $84{,}3\,\mathrm{cm}$; $84{,}1\,\mathrm{cm}$; $84{,}3\,\mathrm{cm}$. Zapiši rezultat z absolutno napako in izračunaj relativno napako.

**Podatki:** $x_1 = 84{,}2\,\mathrm{cm}$; $x_2 = 84{,}4\,\mathrm{cm}$; $x_3 = 84{,}3\,\mathrm{cm}$; $x_4 = 84{,}1\,\mathrm{cm}$; $x_5 = 84{,}3\,\mathrm{cm}$; $n = 5$
**Iščemo:** rezultat $\bar{x} \pm \Delta x$ in relativno napako $\delta$

:::formula
$\bar{x} = \dfrac{x_1 + x_2 + \dots + x_n}{n}$; $\Delta x$ je največje odstopanje $|x_i - \bar{x}|$; $\delta = \dfrac{\Delta x}{\bar{x}}$
:::

**Rešitev:**

1. Vsota: $84{,}2 + 84{,}4 + 84{,}3 + 84{,}1 + 84{,}3 = 421{,}3$, torej $\bar{x} = \dfrac{421{,}3\,\mathrm{cm}}{5} = 84{,}26\,\mathrm{cm}$.
2. Odstopanja od povprečja: $0{,}06$; $0{,}14$; $0{,}04$; $0{,}16$; $0{,}04$ (v cm).
3. Največje je $0{,}16\,\mathrm{cm}$, zaokroženo na eno mesto $\Delta x = 0{,}2\,\mathrm{cm}$.
4. Povprečje zaokrožimo na desetinke, ker je napaka v desetinkah: $84{,}3\,\mathrm{cm}$.
5. Relativna napaka: $\delta = \dfrac{0{,}2\,\mathrm{cm}}{84{,}3\,\mathrm{cm}} \approx 0{,}24\,\%$.
6. Odgovor: deska je dolga $(84{,}3 \pm 0{,}2)\,\mathrm{cm}$, relativna napaka je približno $0{,}2\,\%$. Janovih $84{,}26\,\mathrm{cm}$ je preveč natančen zapis: že desetinka je negotova.

### Primer 2: debelina furnirja (strategija skladovnice)

Furnir je tanka lesena ploščica. Ena je pretanka, da bi jo izmeril z metrom. Zato zložiš $25$ enakih ploščic v skladovnico in izmeriš njeno višino: $15\,\mathrm{mm}$, z napako $1\,\mathrm{mm}$. Kako debela je ena ploščica in s kolikšno napako?

**Podatki:** število ploščic $N = 25$; višina skladovnice $D = 15\,\mathrm{mm}$; napaka $\Delta D = 1\,\mathrm{mm}$
**Iščemo:** debelino ene ploščice $d$, njeno napako $\Delta d$ in relativno napako $\delta$

:::formula
$d = \dfrac{D}{N}$ in $\Delta d = \dfrac{\Delta D}{N}$; relativna napaka $\delta = \dfrac{\Delta D}{D}$ ostane enaka
:::

**Rešitev:**

1. Debelina ene ploščice: $d = \dfrac{15\,\mathrm{mm}}{25} = 0{,}6\,\mathrm{mm}$.
2. Napaka skladovnice se razdeli na vse ploščice: $\Delta d = \dfrac{1\,\mathrm{mm}}{25} = 0{,}04\,\mathrm{mm}$.
3. Relativna napaka: $\delta = \dfrac{1\,\mathrm{mm}}{15\,\mathrm{mm}} \approx 6{,}7\,\%$.
4. Primerjava: ena sama ploščica, izmerjena z metrom, bi dala $0{,}6\,\mathrm{mm}$ z napako $1\,\mathrm{mm}$; napaka bi bila večja od izmerjene vrednosti.
5. Odgovor: ena ploščica je debela $(0{,}60 \pm 0{,}04)\,\mathrm{mm}$. Merjenje več enakih predmetov hkrati zmanjša absolutno napako na en predmet.

### Primer 3: okvir za sliko (dva koraka)

Za okvir slike si izmeril stranici $a = (30{,}0 \pm 0{,}1)\,\mathrm{cm}$ in $b = (40{,}0 \pm 0{,}1)\,\mathrm{cm}$. Koliko letve potrebuješ za obseg in ali zagotovo zadošča letev, dolga $1{,}40\,\mathrm{m}$? Nato izračunaj še ploščino stekla z napako.

**Podatki:** $a = 30{,}0\,\mathrm{cm}$, $\Delta a = 0{,}1\,\mathrm{cm}$; $b = 40{,}0\,\mathrm{cm}$, $\Delta b = 0{,}1\,\mathrm{cm}$; letev $140\,\mathrm{cm}$
**Iščemo:** obseg $o$ z napako, ali letev zadošča, ploščino $S$ z napako

:::formula
$o = 2(a + b)$ in $S = a \cdot b$; napako dobiš tako, da izračunaš z najmanjšima in z največjima stranicama
:::

**Rešitev:**

1. Obseg: $o = 2 \cdot (30{,}0 + 40{,}0)\,\mathrm{cm} = 140{,}0\,\mathrm{cm}$.
2. Najmanjši možni obseg: $2 \cdot (29{,}9 + 39{,}9)\,\mathrm{cm} = 139{,}6\,\mathrm{cm}$; največji: $2 \cdot (30{,}1 + 40{,}1)\,\mathrm{cm} = 140{,}4\,\mathrm{cm}$. Torej $o = (140{,}0 \pm 0{,}4)\,\mathrm{cm}$: napake vseh štirih stranic se seštejejo.
3. Letev $140\,\mathrm{cm}$ morda ne zadošča, saj je obseg lahko do $140{,}4\,\mathrm{cm}$. Varneje je kupiti daljšo.
4. Ploščina stekla: $S = 30{,}0\,\mathrm{cm} \cdot 40{,}0\,\mathrm{cm} = 1200\,\mathrm{cm^2}$.
5. Najmanjšo in največjo ploščino izračunaj sam, nato zapiši $S$ z napako:

:::premisli
Kolikšni sta najmanjša in največja ploščina in kako zapišeš rezultat?
---
Najmanjša: $29{,}9 \cdot 39{,}9 = 1193{,}01\,\mathrm{cm^2}$; največja: $30{,}1 \cdot 40{,}1 = 1207{,}01\,\mathrm{cm^2}$. Obe sta od $1200\,\mathrm{cm^2}$ oddaljeni približno $7\,\mathrm{cm^2}$, zato $S = (1200 \pm 7)\,\mathrm{cm^2}$. Relativna napaka je $\dfrac{7}{1200} \approx 0{,}58\,\%$.
:::

## Pogoste napake

- **Več decimalk pomeni natančnejši rezultat.** Kalkulator izpiše toliko mest, kolikor jih ima prostora, ne toliko, kolikor jih je izmeril meter. Natančnost določa napaka: povprečje zaokroži na njeno decimalko.
- **Napaka je razlika med največjo in najmanjšo meritvijo.** To je razpon, ki je približno dvakrat večji od odstopanja od povprečja. Absolutna napaka je največje odstopanje **od povprečja**.
- **Odstopanja se seštejejo v napako.** Vsota odstopanj raste z vsako novo meritvijo, čeprav meritev ni slabša. Vzemi samo največje odstopanje.
- **Enake meritve nimajo napake.** Pomenijo le, da je merilo pregrobo. Takrat je napaka najmanjši razdelek.
- **Enaka absolutna napaka pomeni enako dobro meritev.** Milimeter pri debelini deske je veliko, pri dolžini sobe skoraj nič. Meritve primerjaj z relativno napako.

## Povzetek

- Ocena: nalogo razbij na korake, uporabi okrogle podatke, rezultat podaj z enim ali dvema mestoma.
- Odčitek je natančen na najmanjši razdelek merila; gledaj pravokotno na skalo in začni pri ničli.
- Povprečje $\bar{x}$ je vsota meritev, deljena z njihovim številom $n$.
- Absolutna napaka $\Delta x$ je največje odstopanje meritve od povprečja; če so vse meritve enake, je najmanjši razdelek.
- Rezultat: $x = \bar{x} \pm \Delta x$, napaka na eno mesto, povprečje na isto decimalko. Relativna napaka $\delta = \dfrac{\Delta x}{\bar{x}}$.
- Strategije: skladovnica več enakih predmetov zmanjša napako na en predmet; napako vsote ali produkta oceniš z najmanjšimi in največjimi vrednostmi.

## Drugače: Na sliki

Janovih pet meritev deske nariši kot pike na številski premici. Dve meritvi sta enaki, $84{,}3\,\mathrm{cm}$, zato je ob tej piki napis »2×«. Odebeljeni pas na premici sega od $\bar{x} - \Delta x = 84{,}10\,\mathrm{cm}$ do $\bar{x} + \Delta x = 84{,}42\,\mathrm{cm}$ (z napako $0{,}16\,\mathrm{cm}$ pred zaokroževanjem) in zajame vse pike.

:::risba premica
opis: Številska premica od 84,0 do 84,5 cm. Pike so pri 84,1; 84,2; 84,3 (dve meritvi) in 84,4. Povprečje je 84,26. Pas od 84,10 do 84,42 zajame vse pike.
od: 84
do: 84,5
korak: 0,1
oznake: 0,1
interval: 84,1 .. 84,42 | | zelena
točka: 84,1
točka: 84,2
točka: 84,3 | 2×
točka: 84,4
:::

Na sliki vidiš tri stvari hkrati. Povprečje $84{,}26\,\mathrm{cm}$ leži na sredini pasu, sredi oblaka pik. Napaka je razdalja od povprečja do najbolj oddaljene pike, tu do $84{,}1\,\mathrm{cm}$. Ožji pas pomeni bolj zbrane meritve.

V simulaciji spodaj »Meritve in merska napaka« izmeri svinčnik desetkrat z ravnilom s centimetri, nato desetkrat z ravnilom z milimetri. Opazi, kako se pas zoži in kolikokrat se zmanjša relativna napaka.

## Drugače: Bolj natančno

**Naključne in sistematične napake.** Vse, kar je bilo doslej, so **naključne** napake: meritve se raztresejo na obe strani prave vrednosti, povprečje pa jih deloma izravna. **Sistematična** napaka vse meritve premakne v isto smer, na primer obrabljen začetek metra, ki manjka $2\,\mathrm{mm}$. Takšne napake povprečje ne odpravi; najdeš jo le, če merilo primerjaš z drugim ali z znano dolžino.

**Napaka vsote in razlike.** Pri vsoti ali razliki dveh izmerjenih dolžin se **absolutni** napaki seštejeta. Če od letve $(100{,}0 \pm 0{,}1)\,\mathrm{cm}$ odrežeš kos $(30{,}0 \pm 0{,}1)\,\mathrm{cm}$, ostane $(70{,}0 \pm 0{,}2)\,\mathrm{cm}$. Napaka se pri odštevanju ne odšteje.

**Napaka produkta.** Pri produktu se približno seštejeta **relativni** napaki. V primeru 3 je $\dfrac{0{,}1}{30} + \dfrac{0{,}1}{40} \approx 0{,}33\,\% + 0{,}25\,\% = 0{,}58\,\%$, enako kot iz najmanjše in največje ploščine.

**Zakaj več meritev pomaga.** Največje odstopanje se z več meritvami ne zmanjša nujno, povprečje pa postane zanesljivejše, ker se naključni odmiki na obe strani vse bolj izravnajo. V srednji šoli boš za to spoznal standardni odklon.

## Preveri se

? Sošolka je polico izmerila petkrat in vpraša, kaj je absolutna napaka. Kateri odgovor ji daš?
- Je razlika med največjo in najmanjšo meritvijo.
~ To je razpon. Ta meri razdaljo med skrajnima meritvama, napaka pa razdaljo od povprečja do najbolj oddaljene meritve.
+ Je največje odstopanje posamezne meritve od povprečja.
- Je vsota vseh odstopanj od povprečja.
~ Vsota bi rasla z vsako dodatno meritvijo, čeprav meritve niso slabše. Šteje le največje odstopanje.
- Je vedno enaka najmanjšemu razdelku merila.
~ Najmanjši razdelek vzamemo samo, kadar so vse meritve enake. Sicer napako določijo odstopanja.
> Absolutna napaka $\Delta x$ je največja vrednost $|x_i - \bar{x}|$ med vsemi meritvami.

? Vijak si izmeril petkrat. Meritve so na sliki. Kolikšna je absolutna napaka?
:::risba premica
opis: Številska premica od 3,3 do 3,8 cm. Pike so pri 3,4; 3,5 (dve meritvi); 3,6 in 3,7 cm.
od: 3,3
do: 3,8
korak: 0,1
oznake: 0,1
točka: 3,4
točka: 3,5 | 2×
točka: 3,6
točka: 3,7
:::
= 0,16 cm | 0,045
~ 0,3 | To je razpon, $3{,}7 - 3{,}4$. Napaka je največje odstopanje od povprečja, ne razlika skrajnih meritev.
~ 0,1 | To je najmanjši razdelek. Ta velja za napako samo, kadar so vse meritve enake.
> Povprečje: $\dfrac{3{,}4 + 3{,}5 + 3{,}5 + 3{,}6 + 3{,}7}{5} = 3{,}54\,\mathrm{cm}$. Največje odstopanje ima $3{,}7\,\mathrm{cm}$: $0{,}16\,\mathrm{cm}$, zaokroženo $0{,}2\,\mathrm{cm}$. Rezultat: $(3{,}5 \pm 0{,}2)\,\mathrm{cm}$.

? Poišči napako v rešitvi. Meritve: $12{,}4\,\mathrm{cm}$; $12{,}6\,\mathrm{cm}$; $12{,}6\,\mathrm{cm}$. (1) Povprečje: $12{,}5333\,\mathrm{cm}$. (2) Odstopanja: $0{,}13$; $0{,}07$; $0{,}07$ (v cm). (3) Absolutna napaka: $0{,}13\,\mathrm{cm} \approx 0{,}1\,\mathrm{cm}$. (4) Rezultat: $(12{,}5333 \pm 0{,}1)\,\mathrm{cm}$. V katerem koraku je napaka?
- V koraku (1).
~ Povprečje je pravilno izračunano: $\dfrac{37{,}6}{3} = 12{,}5333\ldots$ Napaka je v tem, kako ga zapišeš na koncu.
- V koraku (3).
~ Največje odstopanje je res $0{,}13\,\mathrm{cm}$ in zaokroženo $0{,}1\,\mathrm{cm}$. Napake ne sestavljamo z vsoto odstopanj.
+ V koraku (4): povprečje je treba zaokrožiti na desetinke, $(12{,}5 \pm 0{,}1)\,\mathrm{cm}$.
> Če je napaka v desetinkah, so stotinke in tisočinke povprečja izmišljene. Pravilno: $(12{,}5 \pm 0{,}1)\,\mathrm{cm}$.

? Razvrsti meritve od najboljše do najslabše, torej od najmanjše do največje relativne napake.
1. dolžina sobe $(5{,}00 \pm 0{,}02)\,\mathrm{m}$
2. dolžina vijaka $(3{,}5 \pm 0{,}1)\,\mathrm{cm}$
3. debelina deske $(2{,}0 \pm 0{,}1)\,\mathrm{cm}$
> Relativne napake: soba $\dfrac{0{,}02}{5} = 0{,}4\,\%$, vijak $\dfrac{0{,}1}{3{,}5} \approx 2{,}9\,\%$, deska $\dfrac{0{,}1}{2} = 5\,\%$. Soba ima največjo absolutno napako, pa je vseeno najboljša meritev.

? Zidar zida steno $4\,\mathrm{m} \times 2\,\mathrm{m}$. Ena opeka z malto zavzame na steni $25\,\mathrm{cm} \times 8\,\mathrm{cm}$. Koliko opek približno potrebuje?
- Približno $4$.
~ Upošteval si $1\,\mathrm{m^2} = 100\,\mathrm{cm^2}$. Pravilno je $1\,\mathrm{m^2} = 100\,\mathrm{cm} \cdot 100\,\mathrm{cm} = 10\,000\,\mathrm{cm^2}$.
- Približno $40$.
~ Upošteval si $1\,\mathrm{m^2} = 1000\,\mathrm{cm^2}$. Kvadratni meter ima $10\,000\,\mathrm{cm^2}$.
+ Približno $400$.
> Stena: $8\,\mathrm{m^2}$. Opeka: $0{,}25\,\mathrm{m} \cdot 0{,}08\,\mathrm{m} = 0{,}02\,\mathrm{m^2}$. Število: $\dfrac{8}{0{,}02} = 400$. Zidar bo kupil nekaj več zaradi lomljenih opek.

:::simboli
x_1, x_2, x_n | posamezne meritve | | cm
x_i | katerakoli meritev | | cm
l | izmerjena dolžina | | cm
n | število meritev | | –
\bar{x} | povprečje meritev | \bar{x} = \dfrac{x_1 + x_2 + \dots + x_n}{n} | cm
\Delta x | absolutna napaka | | cm | največje odstopanje od $\bar{x}$
\delta | relativna napaka | \delta = \dfrac{\Delta x}{\bar{x}} | – | pogosto v odstotkih
d | debelina ene ploščice | d = \dfrac{D}{N} | mm
D | višina skladovnice | | mm
N | število ploščic | | –
\Delta d | napaka debeline ene ploščice | \Delta d = \dfrac{\Delta D}{N} | mm
\Delta D | napaka višine skladovnice | | mm
o | obseg okvirja | o = 2(a + b) | cm
S | ploščina stekla | S = a \cdot b | cm^2
a, b | stranici okvirja | | cm
:::

<<RACUN
vrednost: 20*2*4 | 160
vrednost: 50/500 | 0.1
vrednost: (60.2+60.5+60.2)/3 | 60.3
vrednost: 0.2/60.3*100 | 0.33
vrednost: 1/20*100 | 5
vrednost: 1/2000*100 | 0.05
vrednost: (84.2+84.4+84.3+84.1+84.3)/5 | 84.26
vrednost: 84.26-84.1 | 0.16
vrednost: 0.2/84.3*100 | 0.24
vrednost: 15/25 | 0.6
vrednost: 1/25 | 0.04
vrednost: 1/15*100 | 6.7
vrednost: 2*(30+40) | 140
vrednost: 2*(29.9+39.9) | 139.6
vrednost: 2*(30.1+40.1) | 140.4
vrednost: 29.9*39.9 | 1193.01
vrednost: 30.1*40.1 | 1207.01
vrednost: 30*40 | 1200
vrednost: 7/1200*100 | 0.58
vrednost: (0.1/30+0.1/40)*100 | 0.58
vrednost: (3.4+3.5+3.5+3.6+3.7)/5 | 3.54
vrednost: 0.1/3.5*100 | 2.9
vrednost: 8/(0.25*0.08) | 400
>>
