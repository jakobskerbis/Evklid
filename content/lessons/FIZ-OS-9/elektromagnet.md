---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Liter vode na indukcijski plošči z močjo $2000\,\mathrm{W}$ zavre v približno treh minutah. Postaviš na isto ploščo aluminijasto posodo z enako količino vode in plošča ne greje, le utripa. Navodila za ploščo celo svetujejo: »Pred nakupom lonca preveri dno z magnetom.«

Zakaj bi kuhalna plošča potrebovala posodo, ki se je prime magnet? Ker je pod steklom skrita ploščata **tuljava**: bakrena žica, navita v veliko zavojev. Ko po njej teče tok, se obnaša kot magnet. Tako napravo imenujemo **elektromagnet**. Najdeš ga v pomivalnem stroju, zvoncu, zvočniku, električni ključavnici in v dvigalu na odpadu za staro železo. Danes odkriješ, kako elektromagnet deluje in kako ga okrepiš.

## Razlaga

**1. Žica in kompas.** Pod ravno žico postavi kompas tako, da je žica vzporedna z iglo. Žico priključi na baterijo prek stikala. Zapiši, kaj opaziš:

- stikalo sklenjeno, tok teče: igla se odkloni;
- stikalo odprto: igla se vrne proti severu;
- pola baterije zamenjaš: igla se odkloni v nasprotno stran.

Iz treh opazovanj sledi pravilo: **električni tok ustvari magnetno polje.** Smer polja je odvisna od smeri toka. Če žico speljemo skozi karton in nanj nasujemo železne opilke, se uredijo v kroge okoli žice. Silnice ravne žice so torej krožnice, v njihovem središču je žica.

**2. Žica, navita v tuljavo.** Polje ene ravne žice je šibko. Zato žico naviješ v vijačnico, kot je navita vzmet. Vsak zavoj je en **ovoj**, število ovojev označimo z $N$. Polja vseh ovojev se znotraj tuljave seštejejo.

Opis slike polja tuljave:

- znotraj tuljave so silnice ravne, vzporedne in goste, polje je tam najmočnejše;
- zunaj se silnice ukrivijo od enega konca do drugega, prav kot pri paličastem magnetu;
- en konec tuljave je severni pol, drugi južni.

Kateri konec je severni, ugotoviš s **pravilom desne roke**: tuljavo objemi z desno roko tako, da prsti kažejo v smeri toka po ovojih. Iztegnjeni palec pokaže severni pol.

:::premisli
Tuljava ima severni pol na desnem koncu. Kaj se zgodi s poloma, če zamenjaš priključka baterije? Napovej, nato pomisli na prvi poskus z žico.
---
Pola se zamenjata: severni pol je zdaj na levem koncu. Tok teče po ovojih v nasprotni smeri, zato tudi polje kaže v nasprotno smer, kot se je pri žici igla odklonila na drugo stran.
:::

**3. Kako močan je elektromagnet.** V tuljavo vtakni železen žebelj, ki mu pravimo **jedro**. Nato preštej, koliko sponk za papir tuljava dvigne. Učenci so izmerili:

| Ovoji $N$ | Tok $I$ [A] | Jedro | Sponke |
|---|---|---|---|
| $50$ | $0{,}5$ | žebelj | $4$ |
| $50$ | $1{,}0$ | žebelj | $8$ |
| $100$ | $0{,}5$ | žebelj | $8$ |
| $100$ | $1{,}0$ | žebelj | $16$ |
| $100$ | $1{,}0$ | brez | $0$ |

Primerjaj prvi dve vrstici. Ko se tok podvoji, se podvoji število sponk. Enako se zgodi, ko se podvoji število ovojev (prva in tretja vrstica). Šteje torej zmnožek obeh: v drugi in tretji vrstici je $N \cdot I$ enak ($50$), zato je enako tudi število sponk.

:::premisli
Koliko sponk bi približno dvignila tuljava z $200$ ovoji pri toku $0{,}5\,\mathrm{A}$ z istim žebljem? Najprej izračunaj $N \cdot I$.
---
Približno $16$ sponk. Velja $200 \cdot 0{,}5 = 100$, kar je enako kot v četrti vrstici ($100 \cdot 1{,}0 = 100$).
:::

**4. Pravilo.** Elektromagnet je tuljava, ki ji je navadno dodano železno jedro. Njegovo polje je močnejše:

- če povečamo tok $I$,
- če povečamo število ovojev $N$,
- če vstavimo jedro iz železa.

Pri isti velikosti tuljave in istem jedru je polje približno sorazmerno z zmnožkom $N \cdot I$. Ker je $N$ samo število, ima $N \cdot I$ enoto amper, $\mathrm{A}$. Dve tuljavi z enakim zmnožkom imata enako močno polje:

$$N_1 \cdot I_1 = N_2 \cdot I_2$$

Zadnja vrstica tabele pokaže, kako pomembno je jedro: brez njega isti tok ne dvigne niti ene sponke. Železo se v polju tuljave namagneti in polje močno okrepi. Ko tok izklopiš, jedro iz mehkega železa skoraj vso magnetnost izgubi, zato sponke odpadejo. Jedro iz jekla bi ostalo namagneteno, zato za elektromagnet ni primerno.

Preizkusi pravilo v simulaciji »Elektromagnet« spodaj: najprej povečaj število ovojev, nato tok. Za konec zamenjaj smer toka in poglej, na katerem koncu je zdaj severni pol.

**5. V kuhinji.** Tuljava v indukcijski plošči dobiva tok, ki več deset tisočkrat na sekundo spremeni smer. Zato tudi pola tuljave ves čas menjata mesti. Tako hitro spreminjajoče se polje segreje dno iz železa, aluminija in stekla pa skoraj ne. V pomivalnem stroju elektromagnet ob vklopu potegne železen zatič in odpre ventil za vodo.

## Rešeni primeri

### Primer 1: čigava ključavnica drži močneje

Ana in Tim v šolski kuhinji gradita model ključavnice za omarico s piškoti. Oba uporabita enak železen žebelj. Anina tuljava ima $100$ ovojev in tok $0{,}6\,\mathrm{A}$, Timova $250$ ovojev in tok $0{,}2\,\mathrm{A}$. Čigav elektromagnet je močnejši?

**Podatki:** $N_\mathrm{A} = 100$, $I_\mathrm{A} = 0{,}6\,\mathrm{A}$, $N_\mathrm{T} = 250$, $I_\mathrm{T} = 0{,}2\,\mathrm{A}$, enako jedro
**Iščemo:** kateri zmnožek $N \cdot I$ je večji

:::formula
Pri enakem jedru je močnejši elektromagnet z večjim $N \cdot I$.
:::

**Rešitev:**

1. Ana: $N_\mathrm{A} \cdot I_\mathrm{A} = 100 \cdot 0{,}6\,\mathrm{A} = 60\,\mathrm{A}$.
2. Tim: $N_\mathrm{T} \cdot I_\mathrm{T} = 250 \cdot 0{,}2\,\mathrm{A} = 50\,\mathrm{A}$.
3. Tim ima več ovojev, a Ana ima toliko večji tok, da je njen zmnožek večji.
4. Odgovor: Anin elektromagnet je nekoliko močnejši.

### Primer 2: manj ovojev, enako polje

Tuljava z $200$ ovoji pri toku $0{,}3\,\mathrm{A}$ ravno še drži železno pokrovko. Žice zmanjka, zato navijemo novo tuljavo s samo $120$ ovoji na isto jedro. Kolikšen tok mora teči, da bo pokrovko držala enako močno?

**Podatki:** $N_1 = 200$, $I_1 = 0{,}3\,\mathrm{A}$, $N_2 = 120$, jedro enako
**Iščemo:** tok $I_2$

:::formula
$N_1 \cdot I_1 = N_2 \cdot I_2$, torej $I_2 = \dfrac{N_1 \cdot I_1}{N_2}$
:::

**Rešitev:**

1. Prva tuljava: $N_1 \cdot I_1 = 200 \cdot 0{,}3\,\mathrm{A} = 60\,\mathrm{A}$.
2. Nova tuljava mora imeti enak zmnožek, zato delimo z novim številom ovojev.
3. $I_2 = \dfrac{60\,\mathrm{A}}{120} = 0{,}5\,\mathrm{A}$.
4. Preverimo: ovojev je manj, zato mora biti tok večji, kar se ujema.
5. Odgovor: skozi novo tuljavo mora teči tok $0{,}5\,\mathrm{A}$.

### Primer 3: ali se ventil odpre

Model elektromagnetnega ventila, kakršen je v pomivalnem stroju, se odpre, ko je $N \cdot I$ vsaj $150\,\mathrm{A}$. Tuljava ima $600$ ovojev in upor $40\,\Omega$, priključena je na napetost $12\,\mathrm{V}$. Ali se ventil odpre?

**Podatki:** $N = 600$, $R = 40\,\Omega$, $U = 12\,\mathrm{V}$, pogoj $N \cdot I \geq 150\,\mathrm{A}$
**Iščemo:** tok $I$, zmnožek $N \cdot I$ in ali se ventil odpre

:::formula
Ohmov zakon $I = \dfrac{U}{R}$, nato zmnožek $N \cdot I$
:::

**Rešitev:**

1. Toka ni v podatkih, zato ga najprej dobimo z Ohmovim zakonom: $I = \dfrac{12\,\mathrm{V}}{40\,\Omega} = 0{,}3\,\mathrm{A}$.
2. Zmnožek: $N \cdot I = 600 \cdot 0{,}3\,\mathrm{A} = 180\,\mathrm{A}$.
3. Primerjamo s pogojem: $180\,\mathrm{A}$ je več kot $150\,\mathrm{A}$.
4. Odgovor: skozi tuljavo teče $0{,}3\,\mathrm{A}$, zmnožek je $180\,\mathrm{A}$, zato se ventil odpre.

### Primer 4: zdaj ti

Isti ventil priključimo na napetost $9\,\mathrm{V}$. Ali se še odpre?

**Podatki:** $N = 600$, $R = 40\,\Omega$, $U = 9\,\mathrm{V}$, pogoj $N \cdot I \geq 150\,\mathrm{A}$
**Iščemo:** ali se ventil odpre

:::formula
$I = \dfrac{U}{R}$, nato $N \cdot I$
:::

**Rešitev:**

1. Tok: $I = \dfrac{9\,\mathrm{V}}{40\,\Omega} = 0{,}225\,\mathrm{A}$.
2. Izračunaj zmnožek $N \cdot I$ in ga primerjaj s pogojem.

:::premisli
Kolikšen je $N \cdot I$ in ali se ventil odpre?
---
$N \cdot I = 600 \cdot 0{,}225\,\mathrm{A} = 135\,\mathrm{A}$. To je manj kot $150\,\mathrm{A}$, zato se ventil ne odpre.
:::

## Pogoste napake

- **»Elektromagnet je magnet tudi brez toka.«** Učenec ga zamenja s trajnim magnetom. Polje pa ustvarja tok: ko ga izklopiš, jedro iz mehkega železa izgubi magnetnost. Prav zato elektromagnet lahko vklapljamo in izklapljamo.
- **»Vsako jedro okrepi polje.«** Zdi se, da je pomembno le, da je v tuljavi kovina. Aluminij ali baker polja skoraj ne spremenita, ker ju magnet ne privlači. Jedro mora biti iz železa.
- **»Več ovojev na isto baterijo vedno pomeni močnejši magnet.«** Več ovojev pomeni daljšo žico, ta pa ima večji upor, zato je pri isti napetosti tok manjši. Izračunaj tok z Ohmovim zakonom in nato preveri $N \cdot I$.
- **»Pola tuljave sta določena za vedno.«** Pola sta odvisna od smeri toka. Ko zamenjaš priključka, se zamenjata tudi pola.
- **»Polje je najmočnejše ob strani tuljave.«** Znotraj so silnice najgostejše, tam je polje najmočnejše.

## Povzetek

- Električni tok ustvari magnetno polje; silnice ravne žice so krožnice okoli žice.
- Tuljava s tokom se obnaša kot paličasti magnet: znotraj je polje najmočnejše, na koncih sta pola.
- Pravilo desne roke: prsti v smeri toka po ovojih, palec kaže severni pol. Obrnjen tok zamenja pola.
- Elektromagnet je tuljava z železnim jedrom. Močnejši je pri večjem toku, več ovojih in z jedrom.
- Pri istem jedru in velikosti je polje približno sorazmerno z $N \cdot I$ (enota $\mathrm{A}$); enako polje: $N_1 \cdot I_1 = N_2 \cdot I_2$.
- Če je dana napetost, tok najprej izračunaj z Ohmovim zakonom $I = \dfrac{U}{R}$.

## Drugače: Korak za korakom s številkami

Ko moraš oceniti ali primerjati elektromagnete:

1. Izpiši $N$, $I$ ali $U$ in $R$ ter preveri, ali je jedro enako.
2. Če toka ni v podatkih, ga izračunaj: $I = \dfrac{U}{R}$. Miliampere pretvori v ampere.
3. Izračunaj zmnožek $N \cdot I$ in mu dopiši enoto $\mathrm{A}$.
4. Primerjaj: večji zmnožek pomeni močnejše polje; enak zmnožek pomeni enako polje.
5. Preveri smiselnost: manj ovojev zahteva večji tok in obratno.

Primer: $80$ ovojev in $0{,}5\,\mathrm{A}$ dasta $40\,\mathrm{A}$, prav toliko kot $40$ ovojev in $1\,\mathrm{A}$. Obe tuljavi na enakem jedru dvigneta približno enako število sponk.

## Drugače: Kot zgodba

Leta 1820 je danski fizik Hans Christian Ørsted med predavanjem opazil nekaj nenavadnega. Ko je sklenil električni krog, se je igla kompasa ob žici zganila. Ko je tok prekinil, se je vrnila. Prvič je nekdo pokazal, da sta elektrika in magnetizem povezana.

Zdaj pa v današnjo kuhinjo. Mojca vklopi pomivalni stroj, ta pa ne zajame vode. Serviser odvije ventil na cevi in pokaže tuljavo: »Ko stroj pošlje tok, tuljava postane magnet in potegne železen zatič, voda steče.« Izmeri: ena žica je pretrgana, krog ni sklenjen. Brez toka ni polja in zatič ostane na mestu.

Ko zamenja tuljavo, stroj zabrni in voda steče. Mojca se nasmehne: »Isto se zgodi pod mojo indukcijsko ploščo, le da tam tok ves čas menja smer.«

## Preveri se

? Mojca kupuje lonec za indukcijsko ploščo. Kateri bo deloval?
- Aluminijast, ker dobro prevaja toploto.
~ Dobra toplotna prevodnost ni dovolj. Indukcijska plošča potrebuje dno, ki ga privlači magnet, aluminija pa ne.
+ Lonec z dnom iz železa ali jekla, ki se ga prime magnet.
- Steklen, ker je plošča tudi steklena.
~ Steklena je le pokrivna plošča. Spreminjajoče se polje tuljave segreje dno iz železa, stekla pa ne.
> Polje tuljave v plošči segreje feromagnetno dno, zato posodo preveriš z magnetom.

? Tuljava ima $100$ ovojev in isto jedro, spreminjamo le tok. Katera meritev ustreza pravilu?
- $0{,}2\,\mathrm{A}$: $5$ sponk, $0{,}4\,\mathrm{A}$: $5$ sponk
~ Ta meritev bi pomenila, da tok ne vpliva na polje. A večji tok da močnejše polje.
- $0{,}2\,\mathrm{A}$: $10$ sponk, $0{,}4\,\mathrm{A}$: $5$ sponk
~ Polje z večjim tokom ne slabi. Pri večjem toku dvigne tuljava več sponk.
+ $0{,}2\,\mathrm{A}$: $5$ sponk, $0{,}4\,\mathrm{A}$: $10$ sponk
> Ko se tok podvoji, se podvoji $N \cdot I$, zato tuljava dvigne približno dvakrat več sponk.

? Zakaj dvigalo na odpadu za staro železo uporablja elektromagnet in ne trajnega magneta?
- Ker je elektromagnet vedno lažji od trajnega magneta.
~ Masa ni bistvo. Odločilno je, da elektromagnet lahko izklopiš.
- Ker trajni magnet železa sploh ne privlači.
~ Trajni magnet železo privlači. Težava je, da ga potem ne spusti.
+ Ker ga lahko izklopiš in s tem spustiš tovor tam, kjer želiš.
> Polje elektromagneta ustvarja tok. Brez toka jedro iz mehkega železa izgubi magnetnost in železo odpade.

? Elektromagnet s $150$ ovoji pri toku $0{,}4\,\mathrm{A}$ dvigne $9$ sponk. Približno koliko sponk dvigne na istem jedru s $300$ ovoji pri toku $0{,}2\,\mathrm{A}$?
- $18$
~ Upošteval si le, da se ovoji podvojijo. Tok pa se je prepolovil.
+ $9$
- $4$
~ Upošteval si le, da se tok prepolovi. Ovojev pa je dvakrat več.
> $150 \cdot 0{,}4 = 60$ in $300 \cdot 0{,}2 = 60$. Zmnožek $N \cdot I$ je enak, zato je polje približno enako.

? Elektromagnet potrebuje $N \cdot I = 90\,\mathrm{A}$, tok je $0{,}3\,\mathrm{A}$. Koliko ovojev mora imeti?
- $27$
~ To je $90 \cdot 0{,}3$. Število ovojev dobiš z deljenjem: $N = \dfrac{90\,\mathrm{A}}{0{,}3\,\mathrm{A}}$.
- $30$
~ Tako dobiš, če $0{,}3$ obravnavaš kot $3$. Pazi na decimalno vejico.
+ $300$
> $N = \dfrac{90\,\mathrm{A}}{0{,}3\,\mathrm{A}} = 300$ ovojev.

:::simboli
N | število ovojev | | – | čisto število
I | električni tok | I = \dfrac{U}{R} | A
N_1 | število ovojev prve tuljave | | –
I_1 | tok skozi prvo tuljavo | | A
N_2 | število ovojev druge tuljave | | –
I_2 | tok skozi drugo tuljavo | I_2 = \dfrac{N_1 \cdot I_1}{N_2} | A
U | električna napetost | U = R \cdot I | V
R | električni upor tuljave | R = \dfrac{U}{I} | Ω
:::
