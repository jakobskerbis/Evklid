---
stanje: osnutek
demo: ohm
avtor: AI
---

## Zakaj se tega učimo

Maja se s staršema pelje proti Piranu. Sredi Krasa navigacija v avtu ugasne in zaslon z zemljevidom ostane črn. Oče najde vzrok: v vtičnici z napetostjo $12\,\text{V}$ je pregorela varovalka. V predalu sta dve rezervni, ena za $0{,}5\,\text{A}$ in ena za $1\,\text{A}$. V navodilih navigacije piše le, da ima upor $20\,\Omega$.

Katero varovalko naj vstavijo? Prešibka bo spet pregorela, premočna pa ne bi ščitila kabla. Odgovor skriva povezava med napetostjo, tokom in uporom, ki jo opisuje **Ohmov zakon**. Ista povezava pove, zakaj se tanek podaljšek pri velikem toku segreje in koliko toka vzame lučka za branje zemljevida. Na njej stojijo tudi vsa električna vezja, ki pridejo v naslednji lekciji.

## Razlaga

**Najprej Majin primer.** Doma Maja navigacijo priključi na nastavljiv vir. Napetost postopno povečuje, ampermeter pa kaže tok:

| $U$ [V] | $I$ [A] | $U/I$ [V/A] |
|---|---|---|
| 3 | 0,15 | 20 |
| 6 | 0,30 | 20 |
| 9 | 0,45 | 20 |
| 12 | 0,60 | 20 |

Ko se napetost podvoji, se podvoji tudi tok. Količnik $U/I$ je v vsaki vrstici enak, $20$. Pri $12\,\text{V}$ v avtu torej teče $0{,}60\,\text{A}$. Varovalka za $0{,}5\,\text{A}$ bi pregorela takoj, zato vstavijo tisto za $1\,\text{A}$.

:::premisli
Kolikšen tok bi tekel, če bi Maja napetost povečala na $15\,\text{V}$? Napovej brez računala.
---
$0{,}75\,\text{A}$. Vsakih $3\,\text{V}$ prinese $0{,}15\,\text{A}$. Napetost $15\,\text{V}$ je petkrat $3\,\text{V}$, torej je tok $5 \cdot 0{,}15\,\text{A}$.
:::

Iz tega enega primera sledi vse, kar je spodaj: kaj točno je tok, kaj ga žene, kaj mu nasprotuje in zakaj je razmerje stalno.

**1. Električni tok.** Električni tok je urejeno gibanje nabitih delcev. V kovinskem vodniku se gibljejo prosti elektroni. Električni tok $I$ pove, koliko naboja steče skozi presek vodnika v enoti časa. Naboj, ki steče skozi presek, delimo s časom, v katerem steče:

$$I = \frac{e}{t}$$

Pri tem je $e$ naboj, ki steče skozi presek vodnika v času $t$. Enota za tok je **amper** ($\text{A}$). Velja $1\,\text{A} = 1\,\dfrac{\text{As}}{\text{s}}$, torej $1\,\text{A}$ pomeni, da v vsaki sekundi steče $1\,\text{As}$ naboja. Enota za naboj je amperska sekunda ($\text{As}$).

**2. Smer toka.** Po dogovoru je smer toka od plusa proti minusu vira. Elektroni se v resnici gibljejo v nasprotno smer, vendar to za računanje ni pomembno.

**3. Napetost.** Da steče tok, mora vir (baterija, vtičnica) ustvariti **električno napetost** $U$. Napetost si lahko predstavljaš kot »potisk«, ki žene naboje po krogu. Enota je **volt** ($\text{V}$). Napetost merimo z voltmetrom, ki ga vežemo **vzporedno** k porabniku. Tok merimo z ampermetrom, ki ga vežemo **zaporedno**, torej v isto vejo vezja.

**4. Električni upor.** Vodnik se toku upira, ker se elektroni na poti zaletavajo v ione kristalne mreže. Ta lastnost se imenuje **električni upor** $R$. Enota je **ohm** ($\Omega$). Večji ko je upor, manjši tok steče pri isti napetosti.

**5. Ohmov zakon.** Pri kovinskih vodnikih pri stalni temperaturi je tok sorazmeren z napetostjo:

$$U = I \cdot R \qquad \Rightarrow \qquad I = \frac{U}{R}, \quad R = \frac{U}{I}$$

Velja $1\,\Omega = 1\,\dfrac{\text{V}}{\text{A}}$. Če napetost podvojimo, se pri enakem uporu podvoji tudi tok. Če pri enaki napetosti podvojimo upor, se tok razpolovi.

**6. Od česa je odvisen upor žice.** Upor je večji, če je žica daljša, in manjši, če je debelejša. Odvisen je tudi od snovi (baker prevaja bolje kot železo) in od temperature.

**7. Grafična predstavitev.** Če za kovinski upornik narišemo graf $I(U)$, dobimo premico skozi koordinatno izhodišče. Strmejša ko je premica, manjši je upor.

:::risba graf
opis: Graf toka I v amperih v odvisnosti od napetosti U v voltih od 0 do 12 V. Polna premica je Majina navigacija z uporom 20 ohmov: pri 12 V doseže 0,6 A. Črtkana premica je upornik s 40 ohmi: pri 12 V doseže 0,3 A. Obe gresta skozi izhodišče, premica za večji upor je bolj položna.
x: 0 .. 12 | 3 | U [V]
y: 0 .. 0,7 | 0,1 | I [A]
f: x/20 | modra | 0 .. 12
f: x/40 | oranžna črtkano | 0 .. 12
napis: 9; 0,55 | 20 Ω | levo
napis: 10; 0,2 | 40 Ω | desno
:::

V simulaciji spodaj (»Električni tok in Ohmov zakon«) nastavi upor na $20\,\Omega$ in napetost povečuj od $0$ do $12\,\text{V}$. Opazuj, da tok narašča v enakih korakih kot v Majini tabeli. Nato upor podvoji in poglej, za koliko pade tok pri isti napetosti.

:::premisli
Zakaj je premica za $40\,\Omega$ ravno pol tako strma kot premica za $20\,\Omega$?
---
Pri vsaki napetosti teče skozi dvakrat večji upor pol manjši tok, $I = \dfrac{U}{R}$. Vsaka točka črtkane premice je zato na polovični višini, na primer $0{,}3\,\text{A}$ namesto $0{,}6\,\text{A}$ pri $12\,\text{V}$.
:::

## Rešeni primeri

### Primer 1: tok iz naboja in časa

Skozi presek vodnika steče v $20\,\text{s}$ naboj $60\,\text{As}$. Kolikšen je tok?

**Podatki:** $t = 20\,\text{s}$, $e = 60\,\text{As}$
**Iščemo:** tok $I$

:::formula
$I = \dfrac{e}{t}$
:::

**Rešitev:**

1. Uporabimo definicijo toka: $I = \dfrac{e}{t}$. Zakaj: tok pove, koliko naboja steče v eni sekundi.
2. Vstavimo: $I = \dfrac{60\,\text{As}}{20\,\text{s}} = 3\,\text{A}$.
3. Preverimo enote: $\dfrac{\text{As}}{\text{s}} = \text{A}$. ✓
4. Odgovor: tok je $3\,\text{A}$.

### Primer 2: Ohmov zakon

Na žarnico z uporom $R = 46\,\Omega$ priključimo napetost $U = 230\,\text{V}$. Kolikšen tok teče skozi njo?

**Podatki:** $R = 46\,\Omega$, $U = 230\,\text{V}$
**Iščemo:** tok $I$

:::formula
Ohmov zakon v obliki z $I$ na levi: $I = \dfrac{U}{R}$
:::

**Rešitev:**

1. Ohmov zakon povezuje vse tri količine, zato ga preoblikujemo za tok: $I = \dfrac{U}{R}$.
2. Vstavimo: $I = \dfrac{230\,\text{V}}{46\,\Omega} = 5\,\text{A}$.
3. Preverimo smiselnost: pri $230\,\text{V}$ in $5\,\text{A}$ bi bil upor res $\dfrac{230}{5} = 46\,\Omega$. ✓
4. Odgovor: skozi žarnico teče tok $5\,\text{A}$.

### Primer 3: izračun upora in vpliv napetosti (težji)

Skozi upornik teče tok $0{,}40\,\text{A}$, ko je priključen na napetost $12\,\text{V}$. a) Kolikšen je upor? b) Kolikšen tok bo tekel, če napetost povečamo na $18\,\text{V}$ (upor se ne spremeni)?

**Podatki:** $I_1 = 0{,}40\,\text{A}$, $U_1 = 12\,\text{V}$, $U_2 = 18\,\text{V}$, upor $R$ se ne spremeni
**Iščemo:** a) upor $R$, b) tok $I_2$ pri napetosti $U_2$

:::formula
$R = \dfrac{U_1}{I_1}$, nato $I_2 = \dfrac{U_2}{R}$
:::

**Rešitev:**

**a)**
1. Iščemo upor: $R = \dfrac{U_1}{I_1}$. Zakaj: upor je razmerje med napetostjo in tokom.
2. $R = \dfrac{12\,\text{V}}{0{,}40\,\text{A}} = 30\,\Omega$.

**b)**
1. Upor je ostal $30\,\Omega$, zato spet uporabimo $I_2 = \dfrac{U_2}{R}$. Zakaj: upor je lastnost upornika in se pri spremembi napetosti ne spremeni.
2. $I_2 = \dfrac{18\,\text{V}}{30\,\Omega} = 0{,}60\,\text{A}$.
3. Preverimo: napetost se je povečala za faktor $\dfrac{18}{12} = 1{,}5$, tok pa tudi: $0{,}40 \cdot 1{,}5 = 0{,}60\,\text{A}$. ✓ To je sorazmernost iz Ohmovega zakona.
4. Odgovor: upor je $30\,\Omega$; pri $18\,\text{V}$ teče tok $0{,}60\,\text{A}$.

### Primer 4 – zdaj ti

Ponoči Maja na zadnjem sedežu bere papirnati zemljevid ob lučki, ki je priključena na $12\,\text{V}$ in ima upor $48\,\Omega$. Koliko naboja steče skozi lučko v $10$ minutah branja?

**Podatki:** $U = 12\,\text{V}$, $R = 48\,\Omega$, $t = 10\,\text{min}$
**Iščemo:** naboj $e$

:::formula
$I = \dfrac{U}{R}$, nato $e = I \cdot t$
:::

**Rešitev:**

1. Tok skozi lučko: $I = \dfrac{U}{R} = \dfrac{12\,\text{V}}{48\,\Omega} = 0{,}25\,\text{A}$. Zakaj: naboja ne poznamo, tok pa dobimo iz Ohmovega zakona.
2. Čas v sekundah: $t = 10 \cdot 60\,\text{s} = 600\,\text{s}$. Zakaj: amper je amperska sekunda na sekundo.
3. Zdaj ti: iz $I = \dfrac{e}{t}$ izrazi naboj in izračunaj.

:::premisli
Koliko naboja steče skozi lučko?
---
$e = I \cdot t = 0{,}25\,\text{A} \cdot 600\,\text{s} = 150\,\text{As}$. Skozi lučko steče $150\,\text{As}$ naboja.
:::

## Pogoste napake

- **Zamenjava formul.** »$I = \dfrac{R}{U} = \dfrac{20}{10} = 2\,\text{A}$.« Večji upor bi tako dal večji tok, kar je v nasprotju z vsem, kar upor pomeni. Pomagaj si s trikotnikom: $U$ je zgoraj, $I$ in $R$ spodaj; prekrij količino, ki jo iščeš. Na koncu preveri: večji upor, manjši tok.
- **Množenje namesto deljenja.** »Tok je $U \cdot R$, saj oboje vpliva nanj.« Tako dobiš pri $12\,\text{V}$ in $3\,\Omega$ kar $36\,\text{A}$. Enota $\text{V} \cdot \Omega$ ni amper, to te opozori. Tok je $\dfrac{U}{R}$, množimo le pri $U = I \cdot R$.
- **»Večja napetost, večji upor.«** Ker se pri večji napetosti spremeni tok, se zdi, da se spremeni tudi upor. Upor je lastnost upornika (snov, dolžina, presek), ne napetosti. Pri kovinskem uporniku se ob podvojeni napetosti podvoji tok, $U/I$ pa ostane enak.
- **Zamenjane meritve.** »Ampermeter vežem vzporedno, da izmeri tok ob uporniku.« Ampermeter ima zelo majhen upor, zato bi vzporedno skozenj stekel velik tok. Ampermeter vežemo zaporedno, voltmeter vzporedno.
- **Pozabljena pretvorba.** »$I = \dfrac{6\,\text{V}}{2\,\text{k}\Omega} = 3\,\text{A}$.« Kilo pomeni tisoč, zato je $2\,\text{k}\Omega = 2000\,\Omega$ in $I = 0{,}003\,\text{A} = 3\,\text{mA}$. Pred vstavljanjem vse pretvori v $\text{V}$, $\text{A}$, $\Omega$ in $\text{s}$.

## Povzetek

- Električni tok je urejeno gibanje nabojev: $I = \dfrac{e}{t}$, enota amper ($\text{A}$).
- Napetost ($\text{V}$) žene tok, upor ($\Omega$) mu nasprotuje.
- Ohmov zakon: $U = I \cdot R$, torej $I = \dfrac{U}{R}$ in $R = \dfrac{U}{I}$.
- Pri kovinskih upornikih je tok sorazmeren z napetostjo, graf $I(U)$ je premica skozi izhodišče.
- Ampermeter vežemo zaporedno, voltmeter vzporedno.

## Drugače: Z analogijo

**Avtocesta.** Predstavljaj si cestninsko postajo. Tok je število avtov, ki jo prevozijo v eni sekundi, ne njihova hitrost. Napetost je kot naklon ceste, ki avte potiska naprej. Upor je zožitev, na primer gradbišče, kjer je odprtih manj pasov.

- Večji naklon pri istem gradbišču: skozi postajo pripelje več avtov na sekundo. To je $I \sim U$ pri stalnem $R$.
- Gradbišče s pol manj odprtimi pasovi pri istem naklonu: pretok pade na polovico. To je $I \sim \dfrac{1}{R}$ pri stalnem $U$.
- Avti se na poti ne »porabijo«: kolikor jih zapelje v gradbišče, toliko jih pride ven. Tudi tok je pred porabnikom in za njim enak.

**Vodna cev.** Črpalka je baterija (njen potisk je napetost), voda je naboj, ozek del cevi je upor. Ožja ko je cev, manj vode steče pri enakem potisku.

Vsaka analogija ima mejo. Avti in voda se gibljejo hitro, elektroni v žici pa zelo počasi. Tok steče skoraj takoj po vsem krogu, ker se ob vklopu začnejo premikati elektroni v celotni žici hkrati.

## Drugače: Iz vsakdanjega življenja

**Polnilnik.** Na ohišju polnilnikov piše napetost in največji tok, na primer $5\,\text{V}$ in $2\,\text{A}$. Naprava, ki jo polniš, določi, koliko toka dejansko vzame, polnilnik pa ga lahko da največ toliko, kot piše na ohišju.

**Zakaj se podaljški segrevajo.** Dolga tanka žica ima večji upor kot kratka debela. Pri velikem toku se zato bolj segreje. Zato so kabli za štedilnik debelejši kot kabli za svetilko.

**Električna varnost.** Človeško telo ima velik upor, vendar pri visoki napetosti steče skozi telo lahko nevaren tok. Ohmov zakon pove, da je tok pri enakem uporu večji, če je napetost večja. Zato je omrežna napetost nevarnejša kot napetost baterije v svetilki.

## Drugače: Korak za korakom s številkami

Recept za vsako nalogo z Ohmovim zakonom:

1. Izpiši, kaj poznaš in kaj iščeš: npr. $U = 9\,\text{V}$, $R = 30\,\Omega$, iščemo $I$.
2. Pretvori enote v $\text{V}$, $\text{A}$, $\Omega$.
3. Izberi obliko enačbe: iščeš tok, uporabi $I = \dfrac{U}{R}$.
4. Vstavi številke z enotami: $I = \dfrac{9\,\text{V}}{30\,\Omega} = 0{,}30\,\text{A}$.
5. Preveri smiselnost: pri večjem uporu mora biti tok manjši.

Tabela za stalno napetost $U = 12\,\text{V}$:

| $R\,[\Omega]$ | $I = U/R\,[\text{A}]$ |
|---|---|
| 6 | 2 |
| 12 | 1 |
| 24 | 0,5 |
| 48 | 0,25 |

Upor se vsakič podvoji, tok pa se vsakič razpolovi. To je obratna sorazmernost med $I$ in $R$ pri stalni napetosti.

Tabela za stalen upor $R = 10\,\Omega$:

| $U\,[\text{V}]$ | $I = U/R\,[\text{A}]$ |
|---|---|
| 2 | 0,2 |
| 4 | 0,4 |
| 8 | 0,8 |
| 16 | 1,6 |

Napetost se podvoji, tok se podvoji. To je premo sorazmerje.

## Drugače: Bolj natančno

**Zakaj ima upor žice določeno vrednost.** Prosti elektroni se v kovini pod vplivom električnega polja pospešujejo, vendar se pogosto zaletavajo v ione kovinske kristalne mreže in pri tem oddajo del energije. Zaradi tega se v povprečju gibljejo s približno stalno hitrostjo, ki je sorazmerna z jakostjo polja, torej z napetostjo. Posledica je sorazmerje $I \sim U$ in zato $\dfrac{U}{I} = R = \text{konst.}$

**Upor žice.** Za homogeno žico dolžine $l$ in preseka $S$ velja

$$R = \rho \cdot \frac{l}{S},$$

kjer je $\rho$ **specifični upor** snovi. Dvakrat daljša žica ima dvakrat večji upor, dvakrat večji presek pa polovični upor.

**Meje Ohmovega zakona.** Ohmov zakon ne velja za vse snovi in naprave. Pri žarnici z žarilno nitko se upor poveča, ko se nitka segreje, zato graf $I(U)$ ni premica. Upornike, pri katerih velja Ohmov zakon, imenujemo ohmski. Pomembno je razlikovati med zakonom ($I \sim U$ pri stalni temperaturi) in definicijo upora ($R = U/I$), ki jo lahko izračunamo za vsak porabnik.

## Preveri se

? Tri trditve o kovinskem uporniku pri stalni temperaturi držijo, ena ne. Katera ne sodi zraven?
- Graf $I(U)$ je premica skozi izhodišče.
~ Ta trditev drži: tok je premo sorazmeren z napetostjo, zato je graf premica skozi izhodišče.
+ Če podvojimo napetost, se podvoji upor.
- Količnik $\dfrac{U}{I}$ je pri vseh napetostih enak.
~ Ta trditev drži: ravno ta stalni količnik je upor, pri Maji je bil vedno $20\,\Omega$.
- Če podvojimo napetost, se podvoji tok.
~ Ta trditev drži, to je Ohmov zakon. Iskana trditev je tista, ki trdi, da se z napetostjo spremeni upor.
> Upor je lastnost upornika (snov, dolžina, presek, temperatura). Ko podvojimo napetost, se podvoji tok, upor $\dfrac{U}{I}$ pa ostane enak.

? Skozi žarnico steče v $5\,\text{s}$ naboj $10\,\text{As}$. Kolikšen je tok?
- $50\,\text{A}$
~ Naboj in čas si pomnožil. Tok je naboj *na* sekundo, zato naboj delimo s časom.
+ $2\,\text{A}$
- $0{,}5\,\text{A}$
~ Delil si čas z nabojem. Enota bi bila $\text{s}/\text{As}$, ne amper.
- $15\,\text{A}$
~ Naboj in čas si seštel. Količin z različnimi enotami ne moremo seštevati.
> Tok je naboj na enoto časa: $I = \dfrac{10\,\text{As}}{5\,\text{s}} = 2\,\text{A}$.

? Pri stalnem uporu napetost na kovinskem uporniku podvojimo. Kaj se zgodi s tokom?
- Tok se razpolovi.
~ To velja, če pri stalni napetosti podvojimo *upor*. Napetost tok poganja, zato ga ne more zmanjšati.
- Tok ostane enak.
~ Morda misliš, da tok določa le upor. Tok je odvisen od obeh, $I = \dfrac{U}{R}$.
+ Tok se podvoji.
- Tok ostane enak, ker se upor podvoji.
~ Upor se z napetostjo ne spreminja; je lastnost upornika, ne vira.
> Po Ohmovem zakonu je $I = \dfrac{U}{R}$. Pri stalnem $R$ je tok premo sorazmeren z napetostjo, zato se z napetostjo podvoji tudi tok.

? Nik računa tok skozi upornik $20\,\Omega$ na napetosti $10\,\text{V}$. 1) $I = \dfrac{U}{R}$. 2) $I = \dfrac{20}{10} = 2$. 3) Tok je $2\,\text{A}$. Kateri korak je napačen?
- Korak 1
~ Formula je pravilna: tok je napetost, deljena z uporom.
+ Korak 2
- Korak 3
~ Korak 3 le prepiše rezultat iz koraka 2; napaka je nastala prej.
- Nobeden
~ Upor ($20\,\Omega$) je večji od števila voltov ($10$), zato mora teči manj kot $1\,\text{A}$. Rezultat $2\,\text{A}$ je prevelik.
> Nik je v koraku 2 zamenjal števec in imenovalec: vstavil je $\dfrac{R}{U}$. Pravilno je $I = \dfrac{10\,\text{V}}{20\,\Omega} = 0{,}5\,\text{A}$.

? Na izletu želi Luka v avtu priključiti grelno blazino z uporom $3\,\Omega$ v vtičnico $12\,\text{V}$, ki je varovana z varovalko $10\,\text{A}$. Kaj se zgodi?
+ Steče $4\,\text{A}$, varovalka zdrži.
- Steče $36\,\text{A}$, varovalka pregori.
~ Napetost in upor si pomnožil. Enota $\text{V} \cdot \Omega$ ni amper; tok je $\dfrac{U}{R}$.
- Steče $0{,}25\,\text{A}$, blazina se komaj segreje.
~ Delil si upor z napetostjo. Pri majhnem uporu mora teči velik tok, ne majhen.
- Upor je tako majhen, da steče neskončen tok in varovalka pregori.
~ Majhen upor pomeni velik, a končen tok: $I = \dfrac{U}{R}$ ima pri $3\,\Omega$ točno določeno vrednost.
> $I = \dfrac{U}{R} = \dfrac{12\,\text{V}}{3\,\Omega} = 4\,\text{A}$, kar je manj od $10\,\text{A}$, zato varovalka zdrži.

:::simboli
I | električni tok | I = \dfrac{e}{t} | A
e | električni naboj | | A\,s | 1 A s = 1 C
t | čas | | s
U | električna napetost | U = I \cdot R | V
R | električni upor | R = \rho \cdot \frac{l}{S} | Ω | za kovine pri stalni temperaturi R = U/I
\rho | specifični upor snovi | | Ω\,m
l | dolžina žice | | m
S | presek žice | | m^2
U_1 | napetost pri prvi meritvi | | V
I_1 | tok pri prvi meritvi | | A
U_2 | napetost pri drugi meritvi | | V
I_2 | tok pri napetosti U₂ | I_2 = \dfrac{U_2}{R} | A
:::
