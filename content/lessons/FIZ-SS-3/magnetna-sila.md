---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Metalec kladiva vleče žico ves čas proti sebi, s silo več tisoč newtonov. Kladivo pa se mu ne približa, ampak kroži okoli njega. Sila, ki kaže proti središču, ne vleče kladiva »noter«, ampak mu le ukrivlja pot.

Magnet zna nekaj še bolj nenavadnega. Bakrene žice ne pritegne. Ko pa po žici steče tok, jo magnet potisne, in to ne proti sebi ali stran od sebe, ampak **vstran**, pravokotno na svoje polje. Elektron, ki prileti v magnetno polje, čuti silo, a se mu hitrost niti malo ne poveča. Le zavije.

Na tej sili temeljijo elektromotorji v električnih kolesih in dirkalnih avtomobilčkih, zvočniki na stadionu in pospeševalniki delcev. Iz prejšnje lekcije poznaš gostoto magnetnega polja $\vec B$ in njeno enoto tesla. Zdaj izveš, kako polje deluje na žico s tokom in na posamezen naboj.

## Razlaga

**1. En primer do konca.** Avtomobilček za dirkalno progo poganja majhen elektromotor. V njem je ravni kos žice, dolg $3\,\mathrm{cm}$, med poloma magneta s poljem $0{,}5\,\mathrm{T}$. Žica je pravokotna na polje, po njej teče $2\,\mathrm{A}$.

Poskusi z žicami s tokom (tokovodniki) v polju (na primer žica, obešena kot gugalnica med poloma podkvastega magneta) pokažejo, da je sila premo sorazmerna s tokom, z dolžino žice v polju in z gostoto polja. Za naš kos žice:

$$F = I\, l\, B = 2\,\mathrm{A} \cdot 0{,}03\,\mathrm{m} \cdot 0{,}5\,\mathrm{T} = 0{,}03\,\mathrm{N}$$

To je majhna sila, zato je v motorju veliko ovojev žice in sile se seštejejo.

Iz tega dobimo tudi pomen tesle: $1\,\mathrm{T} = 1\,\dfrac{\mathrm{N}}{\mathrm{A\,m}}$. V polju $1\,\mathrm{T}$ deluje na $1\,\mathrm{m}$ žice s tokom $1\,\mathrm{A}$, ki je pravokotna na polje, sila $1\,\mathrm{N}$.

**2. Kaj, če žica ni pravokotna?** Žico zasučemo, tako da s poljem oklepa kot $\alpha$. Sila je največja pri $90^\circ$, manjša pri manjšem kotu in nič, ko je žica vzporedna s poljem. Šteje le tisti del dolžine žice, ki je pravokoten na polje, to je $l\sin\alpha$:

$$F = I\, l\, B\, \sin\alpha$$

| Kot $\alpha$ | $\sin\alpha$ | Sila na našo žico |
|---|---|---|
| $90^\circ$ | $1$ | $0{,}03\,\mathrm{N}$ |
| $30^\circ$ | $0{,}5$ | $0{,}015\,\mathrm{N}$ |
| $0^\circ$ | $0$ | $0$ |

:::premisli
Žico v avtomobilčku zasučemo še naprej, da s poljem oklepa $150^\circ$. Tok in polje ostaneta enaka. Je sila večja, manjša ali enaka kot pri $30^\circ$?
---
Enaka, $0{,}015\,\mathrm{N}$. Ker je $\sin 150^\circ = \sin 30^\circ = 0{,}5$, je del dolžine, pravokoten na polje, v obeh legah enako dolg. Ko pa žica leži vzdolž silnic ($0^\circ$ ali $180^\circ$), takega dela ni in sila je nič.
:::

**3. Smer sile.** Sila je pravokotna na žico in na polje hkrati. Smer najdeš s **pravilom desne roke**: iztegnjeni prsti desne roke kažejo v smeri polja $\vec B$, palec v smeri toka, sila pa kaže iz dlani, kot bi z dlanjo potisnil.

Slika v besedah: polje kaže od leve proti desni (od N proti S), tok teče po žici navzgor. Prsti v desno, palec navzgor: dlan gleda stran od tebe, zato sila potiska žico v zaslon. Če obrneš tok ali polje, se sila obrne.

**4. Od žice do enega naboja.** Tok v žici so gibajoči se naboji. Če naboj $e$ v času $t$ preleti kos žice dolžine $l$, je $I\, l = \dfrac{e}{t}\, l = e\, v$. V formuli za silo zato $I\, l$ zamenjamo z $e\, v$ in dobimo silo na en naboj, **magnetno (Lorentzovo) silo**:

$$F = e\, v\, B\, \sin\alpha$$

Tu je $e = 1{,}6\cdot10^{-19}\,\mathrm{A\,s}$ naboj protona (elektron ima nasprotni naboj), $\alpha$ pa kot med hitrostjo in poljem. Pravilo desne roke velja, če palec pokaže smer gibanja **pozitivnega** naboja. Na elektron deluje sila v nasprotno smer.

Iz formule sledi: naboj, ki miruje ($v = 0$), magnetne sile ne čuti.

**5. Zakaj naboj kroži.** Sila je vedno pravokotna na hitrost, zato ne more spremeniti njene velikosti, le smer. Natanko kot pri kladivu: sila proti središču ukrivlja pot, hitrost ostane enaka. Če naboj prileti pravokotno na homogeno polje, kroži. Magnetna sila igra vlogo centripetalne sile:

$$e\, v\, B = \frac{m\, v^2}{r} \quad\Rightarrow\quad r = \frac{m\, v}{e\, B}$$

Hitrejši ali težji delec opiše večji krog, močnejše polje ga zavije v manjšega.

V simulaciji spodaj, »Naboj v magnetnem polju«, izberi proton, hitrost $2\cdot10^6\,\mathrm{m/s}$ in polje $0{,}3\,\mathrm{T}$. Odčitaj polmer kroga. Nato povečaj polje na $0{,}5\,\mathrm{T}$ in opazuj, ali se krog poveča ali zmanjša. Preklopi še smer polja in poglej, v katero smer delec zdaj zavije.

:::premisli
Proton in elektron priletita z enako hitrostjo pravokotno v isto polje. Kateri opiše manjši krog in v katero smer zavije?
---
Elektron. Ima enako velik naboj, a skoraj $2000$-krat manjšo maso, zato je $r = \dfrac{mv}{eB}$ toliko manjši. Ker je negativen, zavije v nasprotno smer kot proton.
:::

## Rešeni primeri

### Primer 1 (lažji): žica med poloma

Ravna žica, dolga $15\,\mathrm{cm}$, je pravokotna na homogeno polje $0{,}2\,\mathrm{T}$. Po njej teče tok $4\,\mathrm{A}$. Kolikšna sila deluje nanjo? Polje kaže v desno, tok navzgor; v katero smer kaže sila?

**Podatki:** $l = 15\,\mathrm{cm}$, $B = 0{,}2\,\mathrm{T}$, $I = 4\,\mathrm{A}$, $\alpha = 90^\circ$, polje v desno, tok navzgor
**Iščemo:** velikost in smer sile $F$

:::formula
$F = I\, l\, B\, \sin\alpha$, smer s pravilom desne roke
:::

**Rešitev:**

1. Dolžina v metrih: $l = 0{,}15\,\mathrm{m}$.
2. Žica je pravokotna na polje, zato je $\sin 90^\circ = 1$.
3. $F = 4\,\mathrm{A} \cdot 0{,}15\,\mathrm{m} \cdot 0{,}2\,\mathrm{T} = 0{,}12\,\mathrm{N}$.
4. Smer: prsti v desno (polje), palec navzgor (tok), dlan gleda v zaslon.
5. Odgovor: na žico deluje sila $0{,}12\,\mathrm{N}$, usmerjena v zaslon, stran od opazovalca.

### Primer 2: proton pod kotom

Proton z nabojem $1{,}6\cdot10^{-19}\,\mathrm{A\,s}$ leti s hitrostjo $2\cdot10^6\,\mathrm{m/s}$ v polju $0{,}3\,\mathrm{T}$. Hitrost s poljem oklepa kot $30^\circ$. Kolikšna magnetna sila deluje nanj?

**Podatki:** $e = 1{,}6\cdot10^{-19}\,\mathrm{A\,s}$, $v = 2\cdot10^6\,\mathrm{m/s}$, $B = 0{,}3\,\mathrm{T}$, $\alpha = 30^\circ$
**Iščemo:** silo $F$

:::formula
$F = e\, v\, B\, \sin\alpha$
:::

**Rešitev:**

1. $\sin 30^\circ = 0{,}5$, ker šteje le pravokotni del hitrosti.
2. $F = 1{,}6\cdot10^{-19}\,\mathrm{A\,s} \cdot 2\cdot10^6\,\mathrm{m/s} \cdot 0{,}3\,\mathrm{T} \cdot 0{,}5$.
3. Najprej številke brez potenc: $1{,}6 \cdot 2 \cdot 0{,}3 \cdot 0{,}5 = 0{,}48$; potenci: $10^{-19} \cdot 10^{6} = 10^{-13}$.
4. $F = 0{,}48\cdot10^{-13}\,\mathrm{N} = 4{,}8\cdot10^{-14}\,\mathrm{N}$.
5. Odgovor: na proton deluje sila $4{,}8\cdot10^{-14}\,\mathrm{N}$, pol manjša kot pri pravokotnem vpadu.

### Primer 3 (težji): polmer kroženja v dveh korakih

Isti proton (masa $1{,}67\cdot10^{-27}\,\mathrm{kg}$) prileti s hitrostjo $2\cdot10^6\,\mathrm{m/s}$ pravokotno v polje $0{,}3\,\mathrm{T}$. Kolikšna je magnetna sila in po krogu s kolikšnim polmerom se giblje? Kaj se zgodi s polmerom, če polje podvojimo?

**Podatki:** $m = 1{,}67\cdot10^{-27}\,\mathrm{kg}$, $e = 1{,}6\cdot10^{-19}\,\mathrm{A\,s}$, $v = 2\cdot10^6\,\mathrm{m/s}$, $B = 0{,}3\,\mathrm{T}$, $\alpha = 90^\circ$
**Iščemo:** silo $F$, polmer $r$ in polmer pri $2B$

:::formula
$F = e\, v\, B$ in $F = \dfrac{m\, v^2}{r}$, torej $r = \dfrac{m\, v}{e\, B}$
:::

**Rešitev:**

1. Sila pri pravokotnem vpadu: $F = 1{,}6\cdot10^{-19} \cdot 2\cdot10^6 \cdot 0{,}3\,\mathrm{N} = 9{,}6\cdot10^{-14}\,\mathrm{N}$.
2. Ta sila je centripetalna, ker je ves čas pravokotna na hitrost: $r = \dfrac{m v^2}{F}$.
3. $r = \dfrac{1{,}67\cdot10^{-27}\,\mathrm{kg} \cdot (2\cdot10^6\,\mathrm{m/s})^2}{9{,}6\cdot10^{-14}\,\mathrm{N}} \approx 0{,}070\,\mathrm{m}$.
4. Pri dvakrat močnejšem polju je sila dvakrat večja, zato je $r$ dvakrat manjši: $r' \approx 0{,}035\,\mathrm{m}$.
5. Odgovor: sila je $9{,}6\cdot10^{-14}\,\mathrm{N}$, proton kroži po krogu s polmerom približno $7\,\mathrm{cm}$; pri $0{,}6\,\mathrm{T}$ le še približno $3{,}5\,\mathrm{cm}$.

### Primer 4: zdaj ti

Motor električnega kolesa ima v polju $0{,}8\,\mathrm{T}$ hkrati $40$ odsekov žice. Vsak je dolg $3\,\mathrm{cm}$, pravokoten na polje, po vsakem teče $10\,\mathrm{A}$. Sile kažejo v isto smer. Kolikšna je skupna sila na rotor?

**Podatki:** $N = 40$, $l = 3\,\mathrm{cm}$, $I = 10\,\mathrm{A}$, $B = 0{,}8\,\mathrm{T}$, $\alpha = 90^\circ$
**Iščemo:** skupno silo $F_\mathrm{s}$

:::formula
$F_\mathrm{s} = N\, I\, l\, B$
:::

**Rešitev:**

1. Dolžina: $l = 0{,}03\,\mathrm{m}$.
2. Sila na en odsek: $F_1 = 10\,\mathrm{A} \cdot 0{,}03\,\mathrm{m} \cdot 0{,}8\,\mathrm{T} = 0{,}24\,\mathrm{N}$.
3. Seštej sile vseh odsekov sam, nato preveri:

:::premisli
Koliko je $F_\mathrm{s} = 40 \cdot 0{,}24\,\mathrm{N}$?
---
$F_\mathrm{s} = 9{,}6\,\mathrm{N}$. Ena žica da le četrt newtona, šele mnogo ovojev skupaj poganja kolo.
:::

## Pogoste napake

- **»Magnet žico vleče k sebi.«** Ker magnet privlači železo, učenci pričakujejo, da bo tudi žico s tokom vlekel proti polu. Magnetna sila pa je pravokotna na polje in na tok. Popravek: smer vedno določi s pravilom desne roke, sila kaže iz dlani.
- **Pozabljeni kot.** Učenec vedno računa $F = I l B$, tudi ko žica ni pravokotna. Pri kotu $\alpha$ je sila manjša, pri vzporedni žici nič. Popravek: vedno zapiši $\sin\alpha$ in preveri, kolikšen je kot.
- **»Sila pospeši naboj.«** Kdor pomisli »sila pomeni večjo hitrost«, pričakuje, da bo proton v polju vse hitrejši. Ker je sila pravokotna na hitrost, ne opravlja dela. Popravek: magnetna sila spremeni le smer, hitrost ostane enaka.
- **»Če sila ne opravi dela, je ni.«** Obratna past: delo je nič, sila pa ne. Brez nje bi delec letel naravnost. Popravek: sila je, ukrivlja pot.
- **Elektron v isto smer kot proton.** Pravilo desne roke velja za pozitiven naboj. Popravek: za elektron določi smer kot za proton in jo obrni.

## Povzetek

- Na žico s tokom v magnetnem polju deluje sila $F = I\, l\, B\, \sin\alpha$, kjer je $\alpha$ kot med žico in poljem.
- Na naboj, ki se giblje, deluje magnetna (Lorentzova) sila $F = e\, v\, B\, \sin\alpha$; na mirujoč naboj ne deluje.
- Sila je pravokotna na polje in na tok (hitrost); smer s pravilom desne roke: prsti v smeri $\vec B$, palec v smeri toka, sila iz dlani. Za negativen naboj je obrnjena.
- Magnetna sila ne spremeni velikosti hitrosti, le smer; pri pravokotnem vpadu naboj kroži s polmerom $r = \dfrac{m v}{e B}$.
- $1\,\mathrm{T} = 1\,\mathrm{N/(A\,m)}$.

## Drugače: Z analogijo

Kladivo iz uvoda že nosi bistvo: vlečna sila je ves čas pravokotna na smer leta, zato kladiva ne pospeši naprej, le obrača.

Proton v magnetnem polju je kladivo, magnetna sila pa ima vlogo napete žice kladiva. Razlika je v tem, kdo »vleče«. Pri kladivu je to atlet v središču, pri protonu ni ničesar v središču kroga. Sila nastane sama, iz gibanja naboja v polju, in vedno kaže pravokotno na hitrost.

Druga analogija je drsalec, ki zavije na ledu. Rob drsalke ga potiska vstran, ne naprej, zato zavije, ne da bi pospešil. Če bi se ustavil, bi stranska sila izginila. Tudi magnetna sila izgine, ko se naboj ustavi.

Meje analogije: pri kladivu in drsalcu sila ni nujno točno pravokotna in atlet lahko kladivo tudi pospeši. Pri magnetni sili je pravokotnost natančna, zato hitrost ostane popolnoma enaka.

## Drugače: Bolj natančno

Silo zapišemo z vektorskim produktom:

$$\vec F = I\, \vec l \times \vec B$$

$$\vec F = q\, \vec v \times \vec B$$

Vektor $\vec l$ kaže v smeri toka, $q$ je naboj z znakom. Velikost vektorskega produkta je $|\vec a||\vec b|\sin\alpha$, smer pa je pravokotna na oba vektorja po pravilu desnega vijaka. Od tod $\sin\alpha$ in obrat sile pri negativnem $q$.

Ker je $\vec F \perp \vec v$, je moč sile $P = \vec F \cdot \vec v = 0$. Magnetna sila ne opravlja dela in kinetična energija delca ostane enaka.

Pri kroženju je obhodni čas

$$t_0 = \frac{2\pi r}{v} = \frac{2\pi m}{q B}$$

neodvisen od hitrosti. Hitrejši delec opiše večji krog v enakem času. To izkorišča **ciklotron**, pospeševalnik, ki delce pospešuje z električnim poljem, magnetno pa jih vodi v krog.

Če sta prisotni obe polji, je skupna sila $\vec F = q(\vec E + \vec v \times \vec B)$. Če ima hitrost tudi komponento vzdolž $\vec B$, se ta ne spremeni, delec pa se giblje po vijačnici.

## Preveri se

? Sošolec ob ogledu posnetka pospeševalnika reče, da je »magnetna sila elektron pognala hitreje«. Kaj pravilno opisuje magnetno silo na gibajoč se naboj?
- Kaže v smeri polja in naboj pospeši.
~ Magnetna sila ne kaže v smeri polja, ampak pravokotno nanj in na hitrost.
+ Je pravokotna na hitrost in na polje; spremeni smer gibanja, ne velikosti hitrosti.
- Deluje na naboj tudi, ko ta miruje.
~ Pri $v = 0$ je $F = e v B \sin\alpha = 0$. Mirujočega naboja magnetno polje ne potiska.
> $F = e v B \sin\alpha$ in sila je pravokotna na $\vec v$, zato ne opravlja dela: hitrost ostane enaka, spremeni se le smer.

? Polje kaže od leve proti desni, tok v navpični žici pa teče navzdol. V katero smer kaže sila na žico?
- V desno, v smeri polja.
~ Magnetna sila ni vzdolž polja, ampak pravokotno nanj.
- V zaslon, stran od tebe.
~ Tako bi bilo pri toku navzgor. Ko se tok obrne, se obrne tudi sila.
- Navzdol, v smeri toka.
~ Sila je pravokotna tudi na žico; vzdolž žice je ne potiska.
+ Iz zaslona, proti tebi.
> Prsti v desno (polje), palec navzdol (tok): dlan gleda proti tebi, zato sila kaže iz zaslona, pravokotno na polje in na žico.

? Proton kroži v magnetnem polju. Kaj se zgodi s polmerom kroga, če gostoto polja podvojimo, hitrost pa ostane enaka?
- Podvoji se, ker močnejša sila delec potisne dlje.
~ Sila kaže proti središču, ne navzven. Večja sila pot bolj ukrivi.
+ Razpolovi se.
- Ostane enak, ker magnetna sila ne opravlja dela.
~ Res je, da ne opravlja dela, zato hitrost ostane enaka. Smer pa spreminja hitreje, zato je krog manjši.
> $r = \dfrac{mv}{eB}$: dvakrat večji $B$ da dvakrat manjši $r$.

? Žica, dolga $40\,\mathrm{cm}$, s tokom $3\,\mathrm{A}$ je v polju $0{,}25\,\mathrm{T}$ pod kotom $30^\circ$ glede na polje. Kolikšna sila deluje nanjo?
- $0{,}30\,\mathrm{N}$
~ Pozabil si na $\sin 30^\circ = 0{,}5$; tako bi bilo le pri pravokotni žici.
- $0{,}26\,\mathrm{N}$
~ Uporabil si $\cos 30^\circ$. V formuli je sinus kota med žico in poljem.
- $15\,\mathrm{N}$
~ Dolžino si vstavil v centimetrih. Pretvori: $l = 0{,}4\,\mathrm{m}$.
+ $0{,}15\,\mathrm{N}$
> $F = 3 \cdot 0{,}4 \cdot 0{,}25 \cdot 0{,}5\,\mathrm{N} = 0{,}15\,\mathrm{N}$.

? Elektron leti s hitrostjo $3\cdot10^6\,\mathrm{m/s}$ pravokotno na polje $0{,}2\,\mathrm{T}$. Kolikšna magnetna sila deluje nanj?
- $0\,\mathrm{N}$, ker magnetna sila ne opravlja dela.
~ Delo je nič, ker je sila pravokotna na hitrost. Sila sama pa ni nič, sicer elektron ne bi zavil.
- $6\cdot10^5\,\mathrm{N}$
~ Pozabil si pomnožiti z nabojem $e = 1{,}6\cdot10^{-19}\,\mathrm{A\,s}$.
+ $9{,}6\cdot10^{-14}\,\mathrm{N}$
> $F = e v B = 1{,}6\cdot10^{-19} \cdot 3\cdot10^6 \cdot 0{,}2\,\mathrm{N} = 9{,}6\cdot10^{-14}\,\mathrm{N}$.

:::simboli
F | magnetna sila | F = I\, l\, B\, \sin\alpha | N | na naboj F = e v B sin α
I | električni tok | | A
l | dolžina žice v polju | | m
B | gostota magnetnega polja | | T | 1 T = 1 N/(A m)
\alpha | kot med žico (hitrostjo) in poljem | | ^\circ
e | naboj delca | | A\,s | osnovni naboj 1,6 · 10⁻¹⁹ A s
v | hitrost delca | | m/s
m | masa delca | | kg
r | polmer krožnice delca | r = \dfrac{m\, v}{e\, B} | m
q | naboj delca z znakom | | A\,s | pri negativnem q sila kaže nasprotno
t_0 | obhodni čas delca | t_0 = \frac{2\pi m}{q B} | s | ni odvisen od hitrosti
F_{\mathrm{s}} | skupna sila na vse odseke žice | F_\mathrm{s} = N\, I\, l\, B | N
N | število odsekov žice | | –
:::
