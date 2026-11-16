---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ana doma kurijo s pečjo na drva. V spletni trgovini najde napravo za $79$ €: majhen toplotni motorček, ki ga postaviš na vročo ploščo peči in poganja generator za polnjenje telefonov. Oglas obljublja: »Iz $500\,\mathrm{W}$ toplote naredi $200\,\mathrm{W}$ električne moči!«

Plošča peči ima okoli $127\,^\circ\mathrm{C}$, v sobi je $27\,^\circ\mathrm{C}$. Ana se sprašuje, ali je obljuba sploh mogoča ali pa bo denar vrgla stran.

Odgovor ne zahteva preizkusa naprave. Dovolj sta dva zakona o energiji, ki ju spoznaš v tej lekciji: kako se toplota razdeli med delo in notranjo energijo ter koliko toplote lahko katerikoli stroj sploh spremeni v delo. Ista pravila povedo, koliko denarja za bencin res poganja avto in zakaj elektrarne potrebujejo hladilne stolpe.

## Razlaga

**1. En primer do konca.** V valju z gibljivim batom je zrak. Bat je lahek in se premika brez trenja, zato je tlak plina ves čas enak zunanjemu, $p = 1{,}0 \cdot 10^5\,\mathrm{Pa}$. Valj počasi segrejemo z gorilnikom in plinu dovedemo toploto $Q = 350\,\mathrm{J}$. Plin se razširi z $1{,}0\,\mathrm{L}$ na $2{,}0\,\mathrm{L}$ in pri tem potisne bat navzven.

Ko plin potiska bat, **opravi delo**. Sila plina na bat je $F = pS$, kjer je $S$ ploščina bata. Bat se premakne za $s$, zato je delo $F s = p S s$. Produkt $S s$ je ravno povečanje prostornine $\Delta V$. Pri stalnem tlaku je torej delo plina

$$A = p\,\Delta V$$

V našem primeru je $\Delta V = 1{,}0\,\mathrm{L} = 1{,}0 \cdot 10^{-3}\,\mathrm{m^3}$, torej

$$A = 1{,}0 \cdot 10^5 \cdot 1{,}0 \cdot 10^{-3} = 100\,\mathrm{J}$$

Od $350\,\mathrm{J}$ dovedene toplote je šlo le $100\,\mathrm{J}$ v delo. Preostalih $250\,\mathrm{J}$ ni izginilo: ostalo je v plinu kot večja **notranja energija** $W_n$. Molekule se gibljejo hitreje, temperatura plina se je zvišala.

**2. Prvi zakon termodinamike.** Iz enega primera lahko zapišemo splošno pravilo. Toplota, ki jo plin prejme, se porabi za spremembo notranje energije in za delo, ki ga plin opravi:

$$\Delta W_n = Q - A$$

To je **prvi zakon termodinamike**, zakon o ohranitvi energije za toploto in delo. Paziti moraš na predznake:

| Količina | pozitivna, ko … | negativna, ko … |
|---|---|---|
| $Q$ | plin prejme toploto | plin odda toploto |
| $A$ | plin se razširi (potiska) | plin stisnemo |
| $\Delta W_n$ | temperatura naraste | temperatura pade |

V šolskem učbeniku morda piše $\Delta W_n = A + Q$. Tam $A$ pomeni delo, ki ga plin *prejme*, pri nas pa delo, ki ga plin *opravi*. Fizika je ista, zamenjan je le predznak dela.

:::premisli
Plin v valju segrejemo z enako toploto $350\,\mathrm{J}$, le da bat trdno pritrdimo. Bo temperatura plina narasla bolj ali manj kot prej? Zakaj?
---
Bolj. Plin se ne more razširiti, zato ne opravi dela ($A = 0$). Vseh $350\,\mathrm{J}$ gre v notranjo energijo, prej le $250\,\mathrm{J}$.
:::

Iz lekcije o notranji energiji poznaš $\Delta W_n = Q$. To je ravno primer s pritrjenim batom: prostornina se ne spreminja in je $A = 0$.

**3. Delo na diagramu $p$–$V$.** Stanje plina lahko narišemo kot točko v diagramu, kjer je na vodoravni osi prostornina, na navpični tlak. Naše razpenjanje pri stalnem tlaku je vodoravna daljica. Ploščina pod njo je pravokotnik s stranicama $p$ in $\Delta V$, torej ravno delo plina.

:::risba graf
opis: Diagram p–V. Na vodoravni osi je prostornina V v litrih od 0 do 3, na navpični tlak p v enotah 10⁵ Pa od 0 do 1,5. Vodoravna daljica pri p = 1 gre od V = 1 L do V = 2 L, puščica kaže proti večji prostornini. Pravokotnik pod daljico je osenčen in označen z A = 100 J.
x: 0 .. 3 | 1 | V [L]
y: 0 .. 1,5 | 0,5 | p [10^5 Pa]
pravokotnik: 1; 0 .. 2; 1 | modra ozadje
črta: 1; 1 -> 2; 1 | modra debelo
puščica: 1,2; 1,2 -> 1,8; 1,2 | razpenjanje | nad
napis: 1,5; 0,5 | A = 100 J | sredina
podnapis: Ploščina pod črto v diagramu p–V je delo plina.
:::

To velja tudi, ko tlak ni stalen: delo je vedno ploščina pod črto v diagramu $p$–$V$. V simulaciji spodaj »Plin v valju: p–V diagram« plin enkrat razširi pri stalnem tlaku, drugič pri stalni temperaturi med istima prostorninama. Opazuj, pri katerem procesu je ploščina pod črto večja in kje plin zato opravi več dela.

**4. Toplotni stroj.** Bat, ki se samo enkrat potisne ven, ne poganja avtomobila. Stroj mora delati v krogu: plin se segreje in razširi, nato ga ohladimo in stisnemo nazaj v začetno stanje. Ker se plin vrne v isto stanje, je na koncu kroga njegova notranja energija enaka kot na začetku. Vsa energija, ki pride vanj, mora iti tudi ven.

Vsak **toplotni stroj** (bencinski motor, parna turbina, Anin motorček) deluje tako:

- iz toplejšega telesa (zgorevanje, vroča para, plošča peči) v enem krogu prejme toploto $Q_1$,
- del te energije odda kot delo $A$,
- ostanek $Q_2$ odda hladnejšemu telesu (okolici, izpuhu, reki).

:::risba skica
opis: Tok energije skozi toplotni stroj. Zgoraj je pravokotnik »toplejše telo, T₁«, spodaj pravokotnik »hladnejše telo, T₂«, v sredini krog »stroj«. Puščica Q₁ gre od toplejšega telesa v stroj, puščica Q₂ od stroja v hladnejše telo, puščica A gre iz stroja vodoravno v desno.
območje: 0; 0 .. 8; 6
enota: 38
pravokotnik: 1; 4,8 .. 7; 5,8 | oranžna ozadje
napis: 4; 5,3 | toplejše telo, T_1 | sredina
krog: 4; 3 | 0,8 | modra
napis: 4; 3 | stroj | sredina
pravokotnik: 1; 0,2 .. 7; 1,2 | modra ozadje
napis: 4; 0,7 | hladnejše telo, T_2 | sredina
puščica: 4; 4,8 -> 4; 3,8 | Q_1 | desno
puščica: 4; 2,2 -> 4; 1,2 | Q_2 | desno
puščica: 4,8; 3 -> 7,2; 3 | A | nad
:::

Pri stroju računamo z velikostmi energij, vse tri so pozitivne. Ohranitev energije za en krog pove

$$Q_1 = A + Q_2$$

**5. Izkoristek.** Plačamo toploto $Q_1$ (gorivo, drva), koristno pa je le delo $A$. Razmerje je **izkoristek**:

$$\eta = \frac{A}{Q_1}$$

Izkoristek nima enote. Pogosto ga zapišemo v odstotkih: $\eta = 0{,}30$ pomeni $30\,\%$. Avtomobilski motor ima okoli $25$ do $35\,\%$, sodobna termoelektrarna okoli $40\,\%$.

**6. Meja, ki je ne preseže noben stroj.** Zakaj ne bi zgradili stroja s $Q_2 = 0$, ki bi vso toploto spremenil v delo? Ker plina ne moremo vrniti v začetno stanje, ne da bi ga ohladili. Del toplote mora vedno oditi v hladnejše telo. To je vsebina **drugega zakona termodinamike**. Francoski inženir Sadi Carnot je izračunal, kolikšen je največji mogoči izkoristek stroja med telesoma s temperaturama $T_1$ in $T_2$:

$$\eta_{\max} = 1 - \frac{T_2}{T_1}$$

Temperaturi morata biti v **kelvinih**. Resnični stroji zaradi trenja in uhajanja toplote dosežejo manj od te meje.

:::premisli
Ana bi motorček postavila na bolj vroče mesto peči, kjer je $327\,^\circ\mathrm{C}$, v sobi pa ostane $27\,^\circ\mathrm{C}$. Napovej, ali se največji izkoristek poveča ali zmanjša, nato ga izračunaj.
---
Poveča se: $T_1 = 600\,\mathrm{K}$, $T_2 = 300\,\mathrm{K}$, $\eta_{\max} = 1 - \dfrac{300}{600} = 0{,}50$. Večja razlika temperatur pomeni večji največji izkoristek.
:::

## Rešeni primeri

### Primer 1: stiskanje v tlačilki

Matic napihuje žogo z ročno tlačilko. Ko enkrat potisne ročaj, na zraku v tlačilki opravi delo $60\,\mathrm{J}$, zrak pa medtem skozi stene odda $15\,\mathrm{J}$ toplote. Za koliko se spremeni notranja energija zraka?

**Podatki:** delo, ki ga opravi Matic na zraku, $60\,\mathrm{J}$, zato je delo zraka $A = -60\,\mathrm{J}$; oddana toplota $15\,\mathrm{J}$, zato je $Q = -15\,\mathrm{J}$
**Iščemo:** spremembo notranje energije $\Delta W_n$

:::formula
$\Delta W_n = Q - A$
:::

**Rešitev:**

1. Določimo predznaka. Zrak je stisnjen, zato je njegovo delo negativno: $A = -60\,\mathrm{J}$. Toploto oddaja, zato $Q = -15\,\mathrm{J}$.
2. Vstavimo: $\Delta W_n = -15\,\mathrm{J} - (-60\,\mathrm{J}) = 45\,\mathrm{J}$.
3. Rezultat je pozitiven, zato se zrak segreje, z njim pa tudi tlačilka.
4. Odgovor: notranja energija zraka se poveča za $45\,\mathrm{J}$.

### Primer 2: razpenjanje pri stalnem tlaku

Plin v valju z batom je pri stalnem tlaku $2{,}0 \cdot 10^5\,\mathrm{Pa}$. Segrejemo ga s toploto $750\,\mathrm{J}$ in prostornina se poveča s $3{,}0\,\mathrm{L}$ na $4{,}5\,\mathrm{L}$. Koliko dela opravi plin in za koliko se mu poveča notranja energija?

**Podatki:** $p = 2{,}0 \cdot 10^5\,\mathrm{Pa}$, $Q = 750\,\mathrm{J}$, $V_1 = 3{,}0\,\mathrm{L}$, $V_2 = 4{,}5\,\mathrm{L}$
**Iščemo:** delo $A$ in spremembo notranje energije $\Delta W_n$

:::formula
$A = p\,\Delta V$, nato $\Delta W_n = Q - A$
:::

**Rešitev:**

1. Sprememba prostornine: $\Delta V = 4{,}5\,\mathrm{L} - 3{,}0\,\mathrm{L} = 1{,}5\,\mathrm{L} = 1{,}5 \cdot 10^{-3}\,\mathrm{m^3}$. Litre pretvorimo, ker je tlak v pascalih.
2. Delo plina: $A = 2{,}0 \cdot 10^5\,\mathrm{Pa} \cdot 1{,}5 \cdot 10^{-3}\,\mathrm{m^3} = 300\,\mathrm{J}$. Plin se razširi, zato je delo pozitivno.
3. Prvi zakon: $\Delta W_n = 750\,\mathrm{J} - 300\,\mathrm{J} = 450\,\mathrm{J}$.
4. Odgovor: plin opravi $300\,\mathrm{J}$ dela, notranja energija se mu poveča za $450\,\mathrm{J}$.

### Primer 3: ali je oglas pošten?

Vrnimo se k Ani. Plošča peči ima $127\,^\circ\mathrm{C}$, soba $27\,^\circ\mathrm{C}$. Oglas trdi, da motorček iz toplotnega toka $500\,\mathrm{W}$ naredi $200\,\mathrm{W}$ moči. Ali je to mogoče? Kolikšna je največja moč, ki jo motorček sploh lahko da?

**Podatki:** $t_1 = 127\,^\circ\mathrm{C}$, $t_2 = 27\,^\circ\mathrm{C}$, prejeti toplotni tok $P_1 = 500\,\mathrm{W}$, obljubljena moč $P = 200\,\mathrm{W}$
**Iščemo:** obljubljeni izkoristek $\eta$, največji izkoristek $\eta_{\max}$ in največjo moč $P_{\max}$

:::formula
$\eta = \dfrac{P}{P_1}$, $\eta_{\max} = 1 - \dfrac{T_2}{T_1}$, $P_{\max} = \eta_{\max} P_1$
:::

**Rešitev:**

1. Toplotni tok $P_1$ je toplota, ki jo stroj prejme v eni sekundi, moč $P$ pa delo, ki ga opravi v eni sekundi. Zato je izkoristek tudi razmerje moči. Oglas obljublja $\eta = \dfrac{200}{500} = 0{,}40$, torej $40\,\%$.
2. Temperaturi pretvorimo v kelvine: $T_1 = 127 + 273 = 400\,\mathrm{K}$, $T_2 = 27 + 273 = 300\,\mathrm{K}$.
3. Največji mogoči izkoristek: $\eta_{\max} = 1 - \dfrac{300}{400} = 0{,}25$, torej $25\,\%$.
4. Največja moč: $P_{\max} = 0{,}25 \cdot 500\,\mathrm{W} = 125\,\mathrm{W}$. Resnični motorček z generatorjem da precej manj.
5. Odgovor: oglas obljublja $40\,\%$, drugi zakon pa dovoli največ $25\,\%$ oziroma $125\,\mathrm{W}$. Obljuba ni mogoča, zato oglasu ne gre zaupati in Ana bo denar raje prihranila.

### Primer 4: zdaj ti

Med eno uro vožnje motor avtomobila iz zgorelega bencina prejme $180\,\mathrm{MJ}$ toplote, okolici (izpuh, hladilnik) pa odda $126\,\mathrm{MJ}$. Bencin za to uro stane $9$ €. Kolikšen je izkoristek motorja in koliko evrov od teh $9$ € se res spremeni v delo?

**Podatki:** $Q_1 = 180\,\mathrm{MJ}$, $Q_2 = 126\,\mathrm{MJ}$, cena bencina $9$ €
**Iščemo:** izkoristek $\eta$ in del cene, ki gre v delo

:::formula
$A = Q_1 - Q_2$, $\eta = \dfrac{A}{Q_1}$
:::

**Rešitev:**

1. Delo motorja: $A = 180\,\mathrm{MJ} - 126\,\mathrm{MJ} = 54\,\mathrm{MJ}$.
2. Zdaj izračunaj izkoristek $\eta$.
3. Del cene, ki gre v delo, je izkoristek, pomnožen s ceno. Izračunaj še to.

:::premisli
Koliko sta $\eta$ in del cene, ki poganja avto?
---
$\eta = \dfrac{54\,\mathrm{MJ}}{180\,\mathrm{MJ}} = 0{,}30$, torej $30\,\%$. V delo gre $0{,}30 \cdot 9 = 2{,}70$ €, preostalih $6{,}30$ € odide kot toplota skozi izpuh in hladilnik.
:::

## Pogoste napake

- **Celzijeve stopinje v Carnotovi formuli.** Z $1 - \dfrac{27}{127}$ dobiš okoli $0{,}79$ in misliš, da je Anin oglas pošten. Razmerje temperatur ima pomen le pri absolutni temperaturi. Vedno najprej prištej $273$.
- **Delo plina prišteješ.** Kdor zapiše $\Delta W_n = Q + A$ z delom, ki ga plin opravi, dobi pri razpenjanju preveč notranje energije. Ko plin potiska bat, energijo oddaja, zato se delo odšteje. Pri stiskanju je $A$ negativen in notranja energija naraste.
- **Izkoristek glede na odvedeno toploto.** $\dfrac{A}{Q_2}$ ni izkoristek. Primerjaš s tem, kar plačaš, torej s prejeto toploto $Q_1$. Tudi $\dfrac{Q_2}{Q_1}$ ni izkoristek, ampak delež, ki gre v izgubo.
- **»Dober stroj ima lahko $100\,\%$.«** Tudi brez trenja mora stroj del toplote oddati hladnejšemu telesu. Boljša tehnika se lahko le približa meji $1 - \dfrac{T_2}{T_1}$.
- **»Brez toplote se temperatura ne spremeni.«** Pri hitrem stiskanju toplota ne uspe uiti ($Q = 0$), a delo, ki ga opravimo na plinu, mu poveča notranjo energijo. Zato se tlačilka segreje.

## Povzetek

- Pri stalnem tlaku plin opravi delo $A = p\,\Delta V$; v splošnem je delo ploščina pod črto v diagramu $p$–$V$.
- Prvi zakon termodinamike: $\Delta W_n = Q - A$. $Q > 0$, ko plin prejme toploto, $A > 0$, ko se plin razširi.
- Toplotni stroj v krogu prejme $Q_1$ od toplejšega telesa, opravi delo $A$ in odda $Q_2$ hladnejšemu: $Q_1 = A + Q_2$.
- Izkoristek $\eta = \dfrac{A}{Q_1}$, brez enote, pogosto v odstotkih.
- Največji izkoristek (Carnot): $\eta_{\max} = 1 - \dfrac{T_2}{T_1}$, temperature v kelvinih. Izkoristek $100\,\%$ ni mogoč (drugi zakon termodinamike).

## Drugače: Z analogijo

Toplotni stroj si predstavljaj kot mlin na vodo. Voda priteče z višine $h_1$, zavrti kolo in odteče na nižjo višino $h_2$. Kolo ne »porabi« vode: vsa voda, ki priteče, tudi odteče. Izkoristi le njen padec.

- Toplota $Q_1$, ki priteče iz vročega telesa, je kot voda, ki priteče od zgoraj.
- Toplota $Q_2$, ki odteče v hladno telo, je kot voda, ki odteče spodaj.
- Delo $A$ je tisto, kar kolo naredi med padcem.

Mlin brez nižje struge ne deluje, saj voda nima kam odteči. Enako stroj ne deluje brez hladnejšega telesa. Večji padec da več dela. Pri stroju igra vlogo »višine« absolutna temperatura, zato je izkoristek tem večji, čim večja je razlika med $T_1$ in $T_2$ v primerjavi s $T_1$. Carnot je o strojih razmišljal prav s to primerjavo.

Analogija ima mejo: pri mlinu voda ostane voda, pri toplotnem stroju pa se del energije res spremeni v delo, zato je $Q_2$ manjši od $Q_1$.

## Drugače: Bolj natančno

**Predznaki v drugih knjigah.** Nekateri učbeniki z $A$ označijo delo, ki ga plin *prejme*, in pišejo $\Delta W_n = Q + A$. Fizika je ista, zamenjan je le predznak dela. Preden uporabiš formulo, preveri, kaj pomeni $A$.

**Krožni proces v diagramu $p$–$V$.** Pri stroju plin opiše zaprto krivuljo. Pri razpenjanju (zgornji del krivulje, večji tlak) plin opravi več dela, kot ga pri stiskanju (spodnji del, manjši tlak) prejme. Ploščina znotraj zanke je delo, ki ga stroj odda v enem krogu.

**Carnotov krog.** Največji izkoristek doseže idealni stroj, ki toploto prejema in oddaja le pri stalni temperaturi (dve izotermi), vmes pa se plin razpenja in stiska brez izmenjave toplote. Vsak resnični stroj med istima temperaturama ima manjši izkoristek.

**Obrnjen stroj.** Hladilnik in toplotna črpalka delujeta obratno: z delom (elektriko) črpata toploto iz hladnejšega v toplejše telo. Sama od sebe toplota vedno teče le s toplejšega na hladnejše telo; to je druga oblika drugega zakona.

## Preveri se

? Tri trditve veljajo za vsak toplotni stroj, ena ne sodi zraven. Katera?
- Prejme toploto od toplejšega telesa.
~ To velja za vsak toplotni stroj: brez vira toplote ni dela.
- Del toplote odda hladnejšemu telesu.
~ To velja vedno in je ravno vsebina drugega zakona termodinamike.
+ Vso prejeto toploto spremeni v delo.
- Opravlja delo v ponavljajočih se krogih.
~ Stroj mora plin vračati v začetno stanje, zato deluje v krogih.
> Noben stroj ne more vse toplote spremeniti v delo: del mora oditi v hladnejše telo, zato je $\eta < 1$.

? Motor v enem krogu prejme $2000\,\mathrm{J}$ toplote in odda $1400\,\mathrm{J}$ toplote. Kolikšen je izkoristek?
- $0{,}70$
~ To je $\dfrac{Q_2}{Q_1}$, delež, ki gre v izgubo, ne v delo.
- $0{,}43$
~ To je $\dfrac{A}{Q_2}$. Izkoristek primerjamo s prejeto toploto $Q_1$.
+ $0{,}30$
- $1{,}43$
~ To je $\dfrac{Q_1}{Q_2}$. Izkoristek ne more biti večji od $1$.
> $A = 2000\,\mathrm{J} - 1400\,\mathrm{J} = 600\,\mathrm{J}$, $\eta = \dfrac{600\,\mathrm{J}}{2000\,\mathrm{J}} = 0{,}30$.

? Zrak v tlačilki zelo hitro stisnemo, tako da toplota ne uspe uiti. Kaj se zgodi s temperaturo zraka?
- Ostane enaka, ker zrak ni prejel toplote.
~ Notranja energija se spremeni tudi z delom. $Q = 0$ ne pomeni $\Delta W_n = 0$.
+ Naraste, ker delo, ki ga opravimo na zraku, poveča njegovo notranjo energijo.
- Pade, ker se je prostornina zmanjšala.
~ Manjša prostornina ne pomeni nižje temperature. Pri stiskanju je $A < 0$, zato $\Delta W_n = -A > 0$.
> Pri $Q = 0$ je $\Delta W_n = -A$. Pri stiskanju je $A$ negativen, zato notranja energija in temperatura narasteta.

? Jure računa največji izkoristek stroja med $227\,^\circ\mathrm{C}$ in $27\,^\circ\mathrm{C}$. Korak 1: $\eta_{\max} = 1 - \dfrac{T_2}{T_1}$. Korak 2: $\eta_{\max} = 1 - \dfrac{27}{227} \approx 0{,}88$. Korak 3: to je $88\,\%$. Kateri korak je napačen?
- Korak 1
~ Formula je Carnotova in je pravilna.
+ Korak 2
- Korak 3
~ Pretvorba v odstotke je pravilna, napaka nastane prej.
- Noben, rezultat je pravilen.
~ $88\,\%$ je za tak stroj veliko previsoko; temperatura mora biti v kelvinih.
> Temperature morajo biti v kelvinih: $\eta_{\max} = 1 - \dfrac{300}{500} = 0{,}40$, torej $40\,\%$.

? Za mesečno vožnjo plačaš $50$ € bencina, motor ima izkoristek $25\,\%$. Koliko evrov bencina se spremeni v delo motorja?
- $37{,}50$ €
~ To je del, ki odide kot toplota: $0{,}75 \cdot 50$ €.
- $50$ €
~ To bi pomenilo izkoristek $100\,\%$, ki ni mogoč.
+ $12{,}50$ €
- $25$ €
~ $25\,\%$ ni $25$ €; izkoristek je delež cene.
> V delo gre $\eta \cdot 50$ € $= 0{,}25 \cdot 50$ € $= 12{,}50$ €, preostanek odide kot toplota.

:::simboli
\Delta W_n | sprememba notranje energije | \Delta W_n = Q - A | J | pozitivna, ko temperatura naraste
W_n | notranja energija | | J
Q | toplota, ki jo plin prejme | | J | pri oddajanju negativna
A | delo, ki ga plin ali stroj opravi | A = p\,\Delta V | J | pri stiskanju plina negativno
p | tlak | | Pa
\Delta V | sprememba prostornine | \Delta V = V_2 - V_1 | m^3
V | prostornina | | m^3
V_1 | začetna prostornina | | m^3
V_2 | končna prostornina | | m^3
Q_1 | toplota, ki jo stroj prejme od toplejšega telesa | Q_1 = A + Q_2 | J
Q_2 | toplota, ki jo stroj odda hladnejšemu telesu | Q_2 = Q_1 - A | J
\eta | izkoristek | \eta = \dfrac{A}{Q_1} | – | pogosto v odstotkih
\eta_{\max} | največji (Carnotov) izkoristek | \eta_{\max} = 1 - \dfrac{T_2}{T_1} | –
T_1 | temperatura toplejšega telesa | T_1 = t_1 + 273\,\mathrm{K} | K
T_2 | temperatura hladnejšega telesa | T_2 = t_2 + 273\,\mathrm{K} | K
t_1, t_2 | temperaturi v stopinjah Celzija | | ^\circ C
P_1 | toplotni tok, ki ga stroj prejme | | W
P | moč (delo v sekundi) | P = \eta P_1 | W
P_{\max} | največja mogoča moč | P_{\max} = \eta_{\max} P_1 | W
:::
