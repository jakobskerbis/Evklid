---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na blagajni trgovine z oblačili prodajalka podrsa jakno čez ravno ploščo. Varnostna nalepka v jakni se »ugasne« in vrata ob izhodu ne zapiskajo več. Nihče se nalepke ni dotaknil, v plošči pa ni trajnega magneta, le navita bakrena žica.

Tu je nekaj, kar se zdi narobe. Baker ni magneten: magnet bakrene žice ne pritegne. Kako lahko potem bakrena žica nalepko razmagneti?

Odgovor je eden najpomembnejših v fiziki: **električni tok ustvarja magnetno polje**. Na tem delujejo elektromagneti, motorji, zvočniki, naprava za magnetno resonanco v bolnišnici in tudi plošča na blagajni. Ko znaš polje opisati s številom, izračunaš, kako močno je ob žici ali v tuljavi, in presodiš, ali je kartici v denarnici sploh nevarno.

## Razlaga

**1. Mamljiva, a napačna ideja.** Večina ljudi misli, da imajo magnetno polje samo magneti in kosi železa. Bakrena žica ni magnet, zato okoli nje polja ne bi smelo biti.

Leta 1820 so to idejo ovrgli s preprostim poskusom. Nad kompas napnemo ravno bakreno žico, vzporedno z iglo. Dokler tok ne teče, igla miruje. Ko sklenemo krog, se igla zasuka skoraj pravokotno na žico. Ko tok prekinemo, se vrne.

Igla se odziva samo na magnetno polje. Ker se zasuka le, ko teče tok, je polje ustvaril tok, ne snov žice. Tudi trajni magnet ni izjema: njegovo polje izvira iz gibanja elektronov v atomih, torej spet iz drobnih »tokov«.

:::premisli
Tok v žici nad kompasom obrnemo, da teče v nasprotno smer. Kaj napoveš za iglo?
---
Igla se zasuka na drugo stran. Smer polja je vezana na smer toka: obrnjen tok da obrnjeno polje.
:::

**2. Gostota magnetnega polja.** Polje ima v vsaki točki velikost in smer, zato ga opišemo z vektorjem $\vec B$. Imenujemo ga **gostota magnetnega polja**.

- **Smer** $\vec B$ je smer, v katero kaže severni pol kompasove igle v tej točki.
- **Velikost** $B$ pove, kako močno polje deluje na magnete in tokove. Natančno jo bomo vezali na silo v lekciji Magnetna sila.
- **Enota** je **tesla**, $\mathrm{T}$. Ena tesla je zelo močno polje, zato pogosto pišemo $\mathrm{mT}$ (militesla) in $\mu\mathrm{T}$ (mikrotesla).

| Izvor | Približna gostota $B$ |
|---|---|
| Zemlja (v Sloveniji) | $50\,\mu\mathrm{T}$ |
| magnet na hladilniku, ob površini | $5\,\mathrm{mT}$ |
| neodimov magnet, ob površini | $0{,}5\,\mathrm{T}$ |
| naprava za magnetno resonanco | $1{,}5$ do $3\,\mathrm{T}$ |

Polje rišemo s **silnicami**. To so črte, na katere se tangentno postavljajo kompasove igle. Kjer so silnice gostejše, je $B$ večji. Silnice so le slika: polje je tudi med njimi.

**3. Druga mamljiva ideja: polje žice kaže od žice.** Kdor pozna električno polje naboja, pričakuje, da silnice tudi tu izhajajo iz žice kot žarki. Kompasi okoli navpične žice pokažejo drugače. Postavijo se v **krog** okoli žice. Silnice so **koncentrične krožnice** s središčem v žici.

Smer določiš s **pravilom desne roke**: žico objameš z desno roko, palec kaže v smeri toka, ukrivljeni prsti kažejo smer silnic.

Slika v besedah, pogled od zgoraj na navpično žico, tok teče proti tebi (iz zaslona). Znak $(\bullet)$ je konica puščice toka, ki gleda vate:

```
      ←  ←
   ↓        ↑
   ↓   (•)  ↑
   ↓        ↑
      →  →
```

Puščice tečejo v nasprotni smeri urnega kazalca. Če tok teče v zaslon, se obrnejo.

**4. Kolikšno je polje ravne žice.** Žici, po kateri teče tok, rečemo tudi **tokovodnik** ali vodnik s tokom. Meritve pokažejo dvoje. Polje je premo sorazmerno s tokom $I$ in obratno sorazmerno z razdaljo $r$ od žice:

$$B = \frac{\mu_0\, I}{2\pi\, r}$$

Konstanta $\mu_0 = 4\pi \cdot 10^{-7}\,\dfrac{\mathrm{V\,s}}{\mathrm{A\,m}}$ je **indukcijska konstanta**. Ker je $\dfrac{\mu_0}{2\pi} = 2 \cdot 10^{-7}$ v istih enotah, je pri žici račun kratek: $B = 2\cdot10^{-7}\,\dfrac{\mathrm{V\,s}}{\mathrm{A\,m}} \cdot \dfrac{I}{r}$.

Pozor: polje pada z $\dfrac{1}{r}$, ne z $\dfrac{1}{r^2}$ kot pri točkastem naboju. Dvakrat dlje od žice je polje dvakrat šibkejše, ne štirikrat.

V simulaciji spodaj, »Magnetno polje magneta, žice in tuljave«, nastavi tok žice na $10\,\mathrm{A}$. Povleci vijolično točko z razdalje $1\,\mathrm{cm}$ na $2\,\mathrm{cm}$ in opazuj, kolikokrat se zmanjša $B$. Nato obrni tok in poglej, kako se obrnejo puščice.

**5. Tuljava.** Žico navijemo v vijačnico z $N$ ovoji na dolžini $l$. Polja posameznih ovojev se v notranjosti seštejejo. Zunaj je polje podobno polju paličastega magneta. Znotraj dolge tuljave je skoraj **homogeno** (povsod enako veliko in enako usmerjeno), njegova gostota pa je:

$$B = \frac{\mu_0\, N\, I}{l}$$

Pomemben je količnik $\dfrac{N}{l}$, to je število ovojev na meter. Gosto navita tuljava z velikim tokom da močno polje. Železno jedro ga še močno poveča, zato je tuljava z jedrom **elektromagnet**.

:::premisli
Tuljavo raztegnemo na dvojno dolžino, število ovojev in tok ostaneta enaka. Sošolec pravi: »Žica je ista, tok je isti, torej se polje ne spremeni.« Kaj napoveš ti in zakaj?
---
Razpolovi se. Ovojev je enako, a so razporejeni na dvakrat daljši dolžini, zato je $\dfrac{N}{l}$ dvakrat manjši. Ista žica in isti tok ne zadoščata, šteje gostota navitja.
:::

## Rešeni primeri

### Primer 1 (lažji): kompas ob žici

Pri šolskem poskusu teče po ravni žici tok $5\,\mathrm{A}$. Kompas je $4\,\mathrm{cm}$ od žice. Kolikšna je gostota magnetnega polja žice na mestu kompasa? Ali bo igla opazno odklonjena?

**Podatki:** $I = 5\,\mathrm{A}$, $r = 4\,\mathrm{cm}$, $\mu_0 = 4\pi\cdot10^{-7}\,\mathrm{V\,s/(A\,m)}$, Zemljino polje okoli $50\,\mu\mathrm{T}$
**Iščemo:** gostoto polja $B$

:::formula
$B = \dfrac{\mu_0\, I}{2\pi\, r}$
:::

**Rešitev:**

1. Razdaljo pretvorimo v metre, ker je $\mu_0$ podan z metri: $r = 0{,}04\,\mathrm{m}$.
2. Vstavimo: $B = \dfrac{4\pi\cdot10^{-7}\,\mathrm{V\,s/(A\,m)} \cdot 5\,\mathrm{A}}{2\pi \cdot 0{,}04\,\mathrm{m}}$.
3. Skrajšamo $2\pi$: $B = \dfrac{2\cdot10^{-7} \cdot 5}{0{,}04}\,\mathrm{T} = 2{,}5\cdot10^{-5}\,\mathrm{T}$.
4. To je $25\,\mu\mathrm{T}$, polovica Zemljinega polja. Polji sta primerljivi, zato se igla opazno zasuka.
5. Odgovor: na mestu kompasa je polje žice $25\,\mu\mathrm{T}$, igla se odkloni.

### Primer 2: plošča na blagajni

V poenostavljenem modelu je v plošči za ugašanje varnostnih nalepk tuljava z $200$ ovoji, dolga $5\,\mathrm{cm}$. Ob pritisku gumba steče tok $4\,\mathrm{A}$. Kolikšna je gostota polja v tuljavi? Kolikokrat je večja od polja magneta na hladilniku ($5\,\mathrm{mT}$)?

**Podatki:** $N = 200$, $l = 5\,\mathrm{cm}$, $I = 4\,\mathrm{A}$, $B_\mathrm{hl} = 5\,\mathrm{mT}$, $\mu_0 = 4\pi\cdot10^{-7}\,\mathrm{V\,s/(A\,m)}$
**Iščemo:** $B$ v tuljavi in razmerje $B / B_\mathrm{hl}$

:::formula
$B = \dfrac{\mu_0\, N\, I}{l}$
:::

**Rešitev:**

1. Dolžina v metrih: $l = 0{,}05\,\mathrm{m}$.
2. Število ovojev na meter: $\dfrac{N}{l} = \dfrac{200}{0{,}05\,\mathrm{m}} = 4000\,\mathrm{m^{-1}}$.
3. $B = 4\pi\cdot10^{-7}\,\mathrm{V\,s/(A\,m)} \cdot 4000\,\mathrm{m^{-1}} \cdot 4\,\mathrm{A} \approx 0{,}020\,\mathrm{T} = 20\,\mathrm{mT}$.
4. Razmerje: $\dfrac{20\,\mathrm{mT}}{5\,\mathrm{mT}} = 4$.
5. Odgovor: v tuljavi je polje približno $20\,\mathrm{mT}$, štirikrat močnejše od magneta na hladilniku, in to brez kosa železa.

### Primer 3 (težji): ali kabel izbriše bančno kartico?

Magnetni trak starejše bančne kartice se lahko izbriše v polju okoli $30\,\mathrm{mT}$. Kupec pri plačilu položi denarnico na pult, pod katerim je kabel. Kolikšen tok bi moral teči po ravni žici, da bi bilo $1\,\mathrm{cm}$ od nje polje $30\,\mathrm{mT}$? Je to nevarno, če po hišnih kablih teče največ okoli $16\,\mathrm{A}$?

**Podatki:** $B = 30\,\mathrm{mT}$, $r = 1\,\mathrm{cm}$, $\mu_0 = 4\pi\cdot10^{-7}\,\mathrm{V\,s/(A\,m)}$, največji tok v hišni napeljavi $16\,\mathrm{A}$
**Iščemo:** potrebni tok $I$

:::formula
Iz $B = \dfrac{\mu_0\, I}{2\pi\, r}$ izrazimo $I = \dfrac{2\pi\, r\, B}{\mu_0}$.
:::

**Rešitev:**

1. Enote: $B = 0{,}03\,\mathrm{T}$, $r = 0{,}01\,\mathrm{m}$.
2. Tok izrazimo, ker je tokrat neznanka $I$, polje pa je dano.
3. $I = \dfrac{2\pi \cdot 0{,}01\,\mathrm{m} \cdot 0{,}03\,\mathrm{T}}{4\pi\cdot10^{-7}\,\mathrm{V\,s/(A\,m)}}$; skrajšamo $2\pi$: $I = \dfrac{0{,}01 \cdot 0{,}03}{2\cdot10^{-7}}\,\mathrm{A} = 1500\,\mathrm{A}$.
4. Primerjava: $\dfrac{1500\,\mathrm{A}}{16\,\mathrm{A}} \approx 94$, potreben bi bil skoraj stokrat večji tok.
5. Odgovor: potreben bi bil tok $1500\,\mathrm{A}$, zato kabel kartice ne ogrozi. Močan neodimov magnet ($0{,}5\,\mathrm{T}$) pa jo lahko.

### Primer 4: zdaj ti

V trgovini z opremo za pohodnike preizkušaš kompas za $12\,\mathrm{€}$. Na kolikšni razdalji od ravne žice s tokom $10\,\mathrm{A}$ je polje žice enako Zemljinemu, $50\,\mu\mathrm{T}$?

**Podatki:** $I = 10\,\mathrm{A}$, $B = 50\,\mu\mathrm{T}$, $\mu_0 = 4\pi\cdot10^{-7}\,\mathrm{V\,s/(A\,m)}$, cena kompasa $12\,\mathrm{€}$ (za račun ni potrebna)
**Iščemo:** razdaljo $r$

:::formula
$r = \dfrac{\mu_0\, I}{2\pi\, B}$
:::

**Rešitev:**

1. Pretvori polje: $B = 50\,\mu\mathrm{T} = 5\cdot10^{-5}\,\mathrm{T}$.
2. Uporabi $\dfrac{\mu_0}{2\pi} = 2\cdot10^{-7}\,\mathrm{V\,s/(A\,m)}$.
3. Izračunaj sam, nato preveri:

:::premisli
Koliko je $r = \dfrac{2\cdot10^{-7} \cdot 10}{5\cdot10^{-5}}\,\mathrm{m}$?
---
$r = 0{,}04\,\mathrm{m} = 4\,\mathrm{cm}$. Bližje od $4\,\mathrm{cm}$ polje žice preglasi Zemljino in igla se ravna bolj po krožnih silnicah žice kot proti severu.
:::

## Pogoste napake

- **»Polje imajo le magneti in železo.«** Zato se zdi, da bakrena žica ne more vplivati na kompas. Narobe: polje ustvari vsak električni tok, snov žice ni pomembna. Popravek: pri vsaki žici s tokom pomisli na polje okoli nje.
- **Silnice žice kot žarki.** Kdor prenese sliko z naboja, nariše silnice od žice navzven. Kompasi pa se postavijo v krog. Popravek: okoli ravne žice so silnice krožnice, smer da pravilo desne roke.
- **Pada s kvadratom razdalje.** Pri točkastem naboju polje pada z $\dfrac{1}{r^2}$, zato učenci isto pričakujejo pri žici. Žica je dolga, ne točkasta, in njeno polje pada le z $\dfrac{1}{r}$. Popravek: dvakrat dlje pomeni dvakrat šibkejše polje.
- **»Daljša tuljava ima več žice, torej močnejše polje.«** Pri istem $N$ se ovoji le razredčijo. Popravek: v tuljavi šteje $\dfrac{N}{l}$, zato je raztegnjena tuljava šibkejša.
- **Centimetri v formuli.** Če vstaviš $r = 4$ namesto $0{,}04\,\mathrm{m}$, dobiš $100$-krat premajhno polje. Popravek: $\mu_0$ je podan z metri, zato pred računom pretvori cm v m.

## Povzetek

- Električni tok ustvarja magnetno polje; tudi polje trajnega magneta izvira iz gibanja elektronov.
- Gostota magnetnega polja $\vec B$ je vektor; smer kaže severni pol kompasove igle. Enota: tesla, $\mathrm{T}$. Zemlja: okoli $50\,\mu\mathrm{T}$.
- Okoli ravne žice so silnice koncentrične krožnice (pravilo desne roke): $B = \dfrac{\mu_0 I}{2\pi r}$, pada z $\dfrac{1}{r}$.
- V dolgi tuljavi je polje homogeno: $B = \dfrac{\mu_0 N I}{l}$; šteje gostota navitja $\dfrac{N}{l}$.
- $\mu_0 = 4\pi\cdot10^{-7}\,\mathrm{V\,s/(A\,m)}$; razdalje in dolžine vstavljaj v metrih.

## Drugače: Kot zgodba

Pomlad 1820, Kopenhagen. Profesor Hans Christian Ørsted predava o elektriki. Na mizi ima baterijo, žico in, po naključju ali namenoma, kompas. Ko sklene krog, se igla kompasa zgane. Po izročilu nihče od poslušalcev ni bil posebej navdušen, Ørsted pa je mesece ponavljal poskus.

Ugotovil je tri stvari. Igla se odziva le, ko teče tok. Obrne se, ko se obrne tok. In ne kaže proti žici, ampak vstran, kot da jo nekaj vrti okoli žice.

Novica je v nekaj tednih prišla do Pariza. André-Marie Ampère je pokazal, da se dve žici s tokom privlačita ali odbijata, in da je zvita žica, tuljava, kot magnet. Elektrika in magnetizem, dotlej dve ločeni poglavji, sta postala eno.

Danes isto zgodbo ponovi vsaka blagajna: tuljava, gumb, sunek toka. Nalepka »izve« za polje, čeprav se je nihče ne dotakne.

## Drugače: Korak za korakom s številkami

Vzemimo ravno žico s tokom $10\,\mathrm{A}$ in računajmo polje na treh razdaljah z $B = 2\cdot10^{-7} \cdot \dfrac{I}{r}$:

| $r$ | $r$ v metrih | $B$ |
|---|---|---|
| $1\,\mathrm{cm}$ | $0{,}01\,\mathrm{m}$ | $200\,\mu\mathrm{T}$ |
| $2\,\mathrm{cm}$ | $0{,}02\,\mathrm{m}$ | $100\,\mu\mathrm{T}$ |
| $4\,\mathrm{cm}$ | $0{,}04\,\mathrm{m}$ | $50\,\mu\mathrm{T}$ |

1. Vsakič, ko razdaljo podvojiš, se polje razpolovi. To je pomen $\dfrac{1}{r}$.
2. Če bi tok podvojil na $20\,\mathrm{A}$, bi se vsak $B$ v tabeli podvojil.
3. Pri $4\,\mathrm{cm}$ je polje enako Zemljinemu. Bližje prevlada žica, dlje Zemlja.

Za tuljavo postopek ponovi v treh korakih:

1. Izračunaj $\dfrac{N}{l}$ v ovojih na meter.
2. Pomnoži z $\mu_0$ in s tokom.
3. Preveri smiselnost: šolske tuljave dajo od nekaj desetink do nekaj deset militesla.

## Preveri se

? Prodajalec pri neodimovem magnetu za $9\,\mathrm{€}$ zapiše »$0{,}5\,\mathrm{T}$ ob površini«. Kaj pove ta podatek?
- S kolikšno silo v newtonih magnet pritegne železo.
~ Sila se meri v newtonih in je odvisna tudi od predmeta. Tesla je enota gostote polja, ne sile.
+ Kolikšna je gostota magnetnega polja tik ob magnetu.
- Koliko železa je v magnetu.
~ Polje ne pove sestave. Tudi bakrena žica s tokom ima polje brez železa.
> Tesla je enota gostote magnetnega polja $B$; $0{,}5\,\mathrm{T}$ je približno desettisočkrat več od Zemljinega polja.

? Razvrsti od najšibkejšega do najmočnejšega: Zemljino polje, polje $1\,\mathrm{cm}$ od žice s tokom $10\,\mathrm{A}$, polje ob magnetu na hladilniku.
- žica, Zemlja, magnet na hladilniku
~ Žica ni najšibkejša: $10\,\mathrm{A}$ na $1\,\mathrm{cm}$ da $200\,\mu\mathrm{T}$, kar je več od Zemljinih $50\,\mu\mathrm{T}$.
+ Zemlja, žica, magnet na hladilniku
- Zemlja, magnet na hladilniku, žica
~ Žica ni nad magnetom: $200\,\mu\mathrm{T} = 0{,}2\,\mathrm{mT}$, magnet na hladilniku ima okoli $5\,\mathrm{mT}$.
> $50\,\mu\mathrm{T} < 200\,\mu\mathrm{T} < 5\,\mathrm{mT}$. Pazi na predpone: $1\,\mathrm{mT} = 1000\,\mu\mathrm{T}$.

? Kompas je $2\,\mathrm{cm}$ od ravne žice. Kaj se zgodi s poljem žice na mestu kompasa, če tok podvojimo in kompas hkrati odmaknemo na $4\,\mathrm{cm}$?
- Podvoji se.
~ Upoštevaš le tok. Večja razdalja polje zmanjša.
- Razpolovi se.
~ Tako bi bilo, če bi polje padalo z $\dfrac{1}{r^2}$. Pri žici pada z $\dfrac{1}{r}$.
+ Ostane enako.
> $B \propto \dfrac{I}{r}$: dvakrat večji tok polje podvoji, dvakrat večja razdalja ga razpolovi.

? Po ravni žici teče $15\,\mathrm{A}$. Kolikšna je gostota polja $5\,\mathrm{cm}$ od nje?
- $0{,}6\,\mu\mathrm{T}$
~ Vstavil si $r = 5$ namesto $0{,}05\,\mathrm{m}$. Najprej pretvori v metre.
- $1{,}2\,\mathrm{mT}$
~ Delil si z $r^2$. Polje žice pada z $\dfrac{1}{r}$.
+ $60\,\mu\mathrm{T}$
- $377\,\mu\mathrm{T}$
~ Pozabil si deliti z $2\pi$. Formula za žico je $B = \dfrac{\mu_0 I}{2\pi r}$.
> $B = \dfrac{2\cdot10^{-7} \cdot 15}{0{,}05}\,\mathrm{T} = 6\cdot10^{-5}\,\mathrm{T} = 60\,\mu\mathrm{T}$.

? Tuljava ima $500$ ovojev in je dolga $25\,\mathrm{cm}$, tok je $2\,\mathrm{A}$. Kolikšna je gostota polja v njej?
- $50\,\mu\mathrm{T}$
~ Dolžino si vstavil v centimetrih. V metrih je $l = 0{,}25\,\mathrm{m}$.
- $0{,}31\,\mathrm{mT}$
~ Pomnožil si z dolžino, kot da daljša tuljava da močnejše polje. Šteje $\dfrac{N}{l}$, zato z $l$ deliš.
+ $5{,}0\,\mathrm{mT}$
> $B = \dfrac{4\pi\cdot10^{-7} \cdot 500 \cdot 2}{0{,}25}\,\mathrm{T} \approx 5{,}0\cdot10^{-3}\,\mathrm{T} = 5{,}0\,\mathrm{mT}$.

:::simboli
B | gostota magnetnega polja | B = \dfrac{\mu_0\, I}{2\pi\, r} | T | v tuljavi B = μ₀ N I / l
\mu_0 | indukcijska konstanta | | V\,s/(A\,m) | 4π · 10⁻⁷ V s/(A m)
I | električni tok | I = \dfrac{2\pi\, r\, B}{\mu_0} | A
r | razdalja od žice | r = \dfrac{\mu_0\, I}{2\pi\, B} | m
N | število ovojev tuljave | | –
l | dolžina tuljave | | m
:::
