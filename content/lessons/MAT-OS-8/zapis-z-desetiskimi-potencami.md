---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ko v tihi sobi zaslišiš najtišji zvok, ki ga uho še zazna, se tvoj bobnič premakne za približno $0{,}00000000001\,\text{m}$. To je manj, kot je velik en sam atom. Pa ga vseeno slišiš.

Na drugem koncu so ogromna števila. Uspešna pesem ima lahko na spletu več milijard predvajanj, na primer $2\,500\,000\,000$. Ultrazvok, s katerim zdravnik pogleda v telo, niha več milijonkrat na sekundo.

Koliko ničel je v $0{,}00000000001$? Če se zmotiš za eno samo, je število desetkrat preveliko ali premajhno. Zato znanstveniki, inženirji zvoka in kalkulatorji pišejo taka števila krajše, s potencami števila $10$. Ta zapis je pregleden, ničel ni treba šteti, velikosti pa primerjaš na prvi pogled.

## Razlaga

**1. Skušnjava: »eksponent je število ničel«.** Pri potencah števila $10$ to drži: $10^3 = 1000$ ima tri ničle, $10^6 = 1\,000\,000$ jih ima šest. Zato se zdi, da velja vedno.

Poglej pa število $4\,500\,000$. Ima pet ničel, a ni enako $4{,}5 \cdot 10^5 = 450\,000$. Pravilno je $4\,500\,000 = 4{,}5 \cdot 10^6$, ker je $4{,}5 \cdot 1\,000\,000 = 4\,500\,000$.

Eksponent torej ne šteje ničel. Šteje, **za koliko mest premakneš decimalno vejico**. Pri $4\,500\,000$ je vejica na koncu. Do $4{,}5$ jo premakneš za $6$ mest v levo, zato je eksponent $6$.

**2. Zapis z desetiško potenco.** Pozitivno število zapišemo v obliki

$$a \cdot 10^n, \qquad 1 \le a < 10$$

Število $a$ ima pred vejico natanko eno števko, ki ni $0$. Eksponent $n$ pove, kolikokrat je treba $a$ pomnožiti z $10$, da dobiš prvotno število. Tak zapis imenujemo tudi **znanstveni zapis**.

:::premisli
Zapis $45 \cdot 10^5$ ima pravo vrednost, $4\,500\,000$. Zakaj ga vseeno ne štejemo za zapis z desetiško potenco?
---
Ker $a = 45$ ni manjši od $10$. Pogoj $1 \le a < 10$ poskrbi, da ima vsako število en sam zapis in da velikost razbereš že iz eksponenta.
:::

**3. Kaj pa zelo majhna števila?** Poglej vrsto potenc. Vsak korak navzdol deli z $10$, eksponent pa se zmanjša za $1$:

| Potenca | Vrednost | Kot ulomek |
|---|---|---|
| $10^2$ | $100$ | |
| $10^1$ | $10$ | |
| $10^0$ | $1$ | |
| $10^{-1}$ | $0{,}1$ | $\frac{1}{10}$ |
| $10^{-2}$ | $0{,}01$ | $\frac{1}{100}$ |
| $10^{-3}$ | $0{,}001$ | $\frac{1}{1000}$ |

Vzorec se nadaljuje čez nič. Zato se dogovorimo: $10^0 = 1$ in $10^{-n} = \dfrac{1}{10^n}$. Pri $10^{-n}$ stoji enica na $n$-tem mestu za vejico.

Tu je druga skušnjava: »minus v eksponentu naredi število negativno«. Ne naredi. $10^{-3}$ ni $-1000$, ampak $0{,}001$, majhno pozitivno število. Minus v eksponentu pomeni deljenje z $10$, ne nasprotnega števila.

:::premisli
Katero število je večje, $10^{-6}$ ali $10^{-5}$? Napovej, preden pogledaš.
---
Večje je $10^{-5} = 0{,}00001$. Število $10^{-6}$ dobiš tako, da $10^{-5}$ deliš z $10$, zato je desetkrat manjše. Pri negativnih eksponentih je število tem manjše, čim večja je absolutna vrednost eksponenta.
:::

**4. Majhno število zapišemo** tako, da vejico premaknemo v **desno**, dokler ne stoji za prvo neničelno števko. Eksponent je negativen, njegova absolutna vrednost je število premikov:

$$0{,}0032 = 3{,}2 \cdot 10^{-3}$$

**5. Nazaj v običajni zapis.** Pri pozitivnem $n$ premakneš vejico za $n$ mest v desno, pri negativnem za toliko mest v levo. Prazna mesta zapolniš z ničlami: $3 \cdot 10^4 = 30\,000$, $7 \cdot 10^{-2} = 0{,}07$.

**6. Primerjava.** Pri pozitivnih številih najprej primerjaš eksponenta: večji eksponent pomeni večje število. Šele pri enakih eksponentih odloča $a$. Zato je $1{,}2 \cdot 10^5$ večje od $9 \cdot 10^4$, čeprav je $9 > 1{,}2$.

V simulaciji spodaj »Od atoma do galaksije: desetiške potence« nastavi eksponent na $2$, nato na $-2$. Opazuj, da točka na premici ne preskoči na negativno stran, ampak se pomakne med $0$ in $1$.

## Rešeni primeri

### Primer 1: ultrazvok

Naprava za ultrazvočni pregled oddaja zvok s frekvenco $3\,500\,000\,\text{Hz}$. Zapiši frekvenco z desetiško potenco.

**Podatki:** frekvenca $3\,500\,000\,\text{Hz}$
**Iščemo:** zapis $a \cdot 10^n$ z $1 \le a < 10$

:::formula
$a \cdot 10^n$, $n$ = število mest, za katera premakneš vejico v levo
:::

**Rešitev:**

1. Prva števka je $3$, zato bo $a = 3{,}5$ (vejico postavimo za trojko).
2. Vejica je na koncu števila. Do $3{,}5$ jo premaknemo za $6$ mest v levo.
3. Število je večje od $10$, zato je eksponent pozitiven: $n = 6$.
4. Preverimo: $3{,}5 \cdot 10^6 = 3{,}5 \cdot 1\,000\,000 = 3\,500\,000$.
5. Odgovor: frekvenca je $3{,}5 \cdot 10^6\,\text{Hz}$.

### Primer 2: en nihaj strune

Struna, uglašena na ton A, opravi en nihaj v približno $0{,}0023\,\text{s}$. Zapiši ta čas z desetiško potenco.

**Podatki:** čas enega nihaja $0{,}0023\,\text{s}$
**Iščemo:** zapis $a \cdot 10^n$ z $1 \le a < 10$

:::formula
$a \cdot 10^{-n}$, $n$ = število mest, za katera premakneš vejico v desno
:::

**Rešitev:**

1. Prva neničelna števka je $2$, zato bo $a = 2{,}3$.
2. Od $0{,}0023$ do $2{,}3$ premaknemo vejico za $3$ mesta v desno (čez $0$, $0$ in $2$).
3. Število je manjše od $1$, zato je eksponent negativen: $-3$.
4. Preverimo: $2{,}3 \cdot 10^{-3} = 2{,}3 \cdot 0{,}001 = 0{,}0023$.
5. Odgovor: en nihaj traja $2{,}3 \cdot 10^{-3}\,\text{s}$.

### Primer 3 (težji): koliko časa so poslušali pesem

Pesem traja $200\,\text{s}$ in so jo na spletu predvajali $15\,000\,000$-krat. Koliko sekund glasbe so poslušalci skupaj slišali? Račun izpelji z desetiškimi potencami.

**Podatki:** dolžina pesmi $200\,\text{s}$, število predvajanj $15\,000\,000$
**Iščemo:** skupni čas poslušanja v zapisu $a \cdot 10^n$

:::formula
$10^m \cdot 10^n = 10^{m+n}$
:::

**Rešitev:**

1. Obe števili zapišemo s potencami: $200 = 2 \cdot 10^2$ in $15\,000\,000 = 1{,}5 \cdot 10^7$.
2. Množenje lahko premešamo: števili posebej in potenci posebej. $2 \cdot 1{,}5 = 3$.
3. Potenci z enako osnovo množimo tako, da eksponenta seštejemo: $10^2 \cdot 10^7 = 10^9$.
4. Skupaj: $3 \cdot 10^9\,\text{s}$. Ker je $3$ med $1$ in $10$, je zapis že pravilen.
5. Odgovor: poslušalci so slišali $3 \cdot 10^9\,\text{s}$ glasbe. To je približno $95$ let neprekinjenega poslušanja.

### Primer 4 – zdaj ti: najvišji ton

Valovna dolžina najvišjega tona, ki ga mlado uho še sliši, je v zraku približno $0{,}017\,\text{m}$. Zapiši jo z desetiško potenco.

**Podatki:** valovna dolžina $0{,}017\,\text{m}$
**Iščemo:** zapis $a \cdot 10^n$ z $1 \le a < 10$

:::formula
$a \cdot 10^{-n}$, $n$ = število mest, za katera premakneš vejico v desno
:::

**Rešitev:**

1. Prva neničelna števka je $1$, zato bo $a = 1{,}7$.
2. Vejico premakneš v desno, dokler ne stoji za enico. Preštej premike in zapiši rezultat sam, nato preveri:

:::premisli
Koliko je $0{,}017\,\text{m}$ z desetiško potenco?
---
Vejico premaknemo za $2$ mesti v desno (čez $0$ in $1$), število je manjše od $1$: $0{,}017\,\text{m} = 1{,}7 \cdot 10^{-2}\,\text{m}$. Preizkus: $1{,}7 \cdot 0{,}01 = 0{,}017$.
:::

## Pogoste napake

- **Štetje ničel namesto premikov.** Pri $4\,500\,000$ nekdo prešteje pet ničel in zapiše $4{,}5 \cdot 10^5$. To je le $450\,000$. Eksponent je število mest, za katera premakneš vejico, zato $4{,}5 \cdot 10^6$.
- **Negativen eksponent kot negativno število.** »$10^{-3}$ je $-1000$.« Minus v eksponentu pomeni deljenje: $10^{-3} = \dfrac{1}{1000} = 0{,}001$. Ne zamenjaj ga z $-10^3 = -1000$.
- **Število $a$ zunaj meja.** $25 \cdot 10^5$ ali $0{,}5 \cdot 10^{-5}$ imata pravo vrednost, a nista pravilno zapisana, ker $a$ ni med $1$ in $10$. Popravi: $2{,}5 \cdot 10^6$ in $5 \cdot 10^{-6}$.
- **Primerjanje samo števila $a$.** »$9 \cdot 10^4$ je večje od $1{,}2 \cdot 10^5$, ker je $9 > 1{,}2$.« Eksponent pove velikost bolj kot $a$: $90\,000 < 120\,000$. Najprej primerjaj eksponenta.
- **Pri $10^{-n}$: večji $n$, večje število.** $10^{-6}$ ni večje od $10^{-5}$. Vsak korak k bolj negativnemu eksponentu deli z $10$.

## Povzetek

- Zapis z desetiško potenco: $a \cdot 10^n$, kjer je $1 \le a < 10$ in $n$ celo število.
- Eksponent ni število ničel, ampak število mest, za katera premakneš vejico.
- Veliko število: vejica gre v levo, eksponent je pozitiven. Majhno število (manjše od $1$): vejica gre v desno, eksponent je negativen.
- $10^0 = 1$ in $10^{-n} = \dfrac{1}{10^n}$; negativen eksponent da majhno pozitivno število.
- Primerjava: najprej eksponenta, pri enakih eksponentih število $a$.
- Pri množenju množiš števili $a$ in seštevaš eksponenta.

## Drugače: Kot zgodba

Ana snema zvok za šolski koncert. Program za snemanje ji pokaže, da je v posnetku $1{,}2 \cdot 10^7$ vzorcev. Ana se ustraši: koliko je to?

Spomni se pravila: eksponent $7$ pomeni, da vejico v $1{,}2$ premakne za $7$ mest v desno. Napiše $1{,}2$, nato prestavlja vejico: $12$, $120$, $1200$ in tako naprej, dokler ne našteje sedmih korakov. Dobi $12\,000\,000$, dvanajst milijonov vzorcev.

Nato pogleda nastavitve mikrofona. Membrana se pri tihem šepetu premakne za približno $5 \cdot 10^{-9}\,\text{m}$. Tu je eksponent negativen, zato vejico pri $5$ premika v levo: $0{,}5$; $0{,}05$ in tako naprej, devetkrat. Dobi $0{,}000000005\,\text{m}$.

Ana opazi, da sta obe števili v zapisu s potencami enako kratki. Velikost je skrita v eksponentu: $7$ pomeni »zelo veliko«, $-9$ pa »zelo majhno«. Za primerjavo ji ni treba šteti ničel, dovolj je pogledati eksponenta.

## Drugače: Korak za korakom s številkami

Recept za zapis z desetiško potenco:

1. Poišči prvo neničelno števko.
2. Vejico postavi takoj za njo. Tako dobiš $a$.
3. Preštej, za koliko mest si premaknil vejico.
4. Če je bilo število večje od $10$, je eksponent pozitiven; če je manjše od $1$, negativen.

| Običajni zapis | Premik vejice | Z desetiško potenco |
|---|---|---|
| $6\,300$ | $3$ mesta levo | $6{,}3 \cdot 10^3$ |
| $520\,000$ | $5$ mest levo | $5{,}2 \cdot 10^5$ |
| $4{,}8$ | ni premika | $4{,}8 \cdot 10^0$ |
| $0{,}07$ | $2$ mesti desno | $7 \cdot 10^{-2}$ |
| $0{,}000091$ | $5$ mest desno | $9{,}1 \cdot 10^{-5}$ |

Vrstica s $4{,}8$ pokaže, zakaj potrebujemo $10^0 = 1$: števila med $1$ in $10$ ne premikamo.

## Drugače: Bolj natančno

Zakaj premik vejice ustreza desetiški potenci? Vsako mesto v desetiškem zapisu ima vrednost potence števila $10$:

$$4\,500\,000 = 4 \cdot 10^6 + 5 \cdot 10^5$$

Ker je $10^5$ desetina od $10^6$, je $5 \cdot 10^5 = 0{,}5 \cdot 10^6$. Izpostavimo $10^6$:

$$4 \cdot 10^6 + 0{,}5 \cdot 10^6 = 4{,}5 \cdot 10^6$$

Pri majhnih številih velja enako: $0{,}0032 = 3 \cdot 10^{-3} + 2 \cdot 10^{-4}$, in ker je $10^{-4}$ desetina od $10^{-3}$, je to $3{,}2 \cdot 10^{-3}$. Vsak premik vejice za eno mesto število pomnoži ali deli z $10$, eksponent pa to popravi za $1$.

## Preveri se

? Profesionalni posnetki imajo $4{,}8 \cdot 10^4$ vzorcev zvoka na sekundo, torej $48\,000$. Kaj v tem zapisu pove eksponent $4$?
- Koliko ničel ima število $48\,000$.
~ Število $48\,000$ ima tri ničle, ne štiri. Eksponent ne šteje ničel.
+ Za koliko mest premakneš vejico v $4{,}8$ v desno, da dobiš $48\,000$.
- Da število $4{,}8$ pomnožiš s $4$.
~ Eksponent ni faktor: $10^4$ je $10 \cdot 10 \cdot 10 \cdot 10$, ne $4$.
- Koliko števk ima število $48\,000$.
~ Število ima pet števk. Eksponent je število premikov vejice.
> $4{,}8 \cdot 10^4 = 4{,}8 \cdot 10\,000 = 48\,000$: vejica se premakne za $4$ mesta v desno.

? Katera razvrstitev od najmanjšega do največjega je pravilna?
- $1{,}5 \cdot 10^{-2} < 3 \cdot 10^{-2} < 8 \cdot 10^{-3}$
~ Primerjal si le števila $a$ ali pa mislil, da je $10^{-3}$ večje od $10^{-2}$. Velja obratno: $10^{-3} = 0{,}001 < 0{,}01$.
+ $8 \cdot 10^{-3} < 1{,}5 \cdot 10^{-2} < 3 \cdot 10^{-2}$
- $8 \cdot 10^{-3} < 3 \cdot 10^{-2} < 1{,}5 \cdot 10^{-2}$
~ Eksponenta si primerjal pravilno, a pri enakem eksponentu odloča $a$: $1{,}5 < 3$.
> V običajnem zapisu: $0{,}008 < 0{,}015 < 0{,}03$. Najmanjši eksponent ($-3$) da najmanjše število, pri enakih eksponentih odloča $a$.

? Kaj se zgodi s številom $2 \cdot 10^{-3}$, če eksponent spremenimo v $-4$?
- Postane desetkrat večje, ker je $4$ več kot $3$.
~ Pri negativnih eksponentih je $-4$ manj kot $-3$. Število se deli z $10$.
+ Postane desetkrat manjše.
- Postane negativno.
~ Negativen eksponent ne da negativnega števila. $2 \cdot 10^{-4} = 0{,}0002$ je pozitivno.
- Zmanjša se za $1$.
~ Sprememba eksponenta za $1$ pomeni množenje ali deljenje z $10$, ne odštevanje $1$.
> $2 \cdot 10^{-3} = 0{,}002$; $2 \cdot 10^{-4} = 0{,}0002$. Vejica se premakne še za eno mesto v levo.

? Membrana mikrofona je debela $0{,}000005\,\text{m}$. Kateri zapis je pravilen zapis z desetiško potenco?
- $5 \cdot 10^{-5}\,\text{m}$
~ Prešteti si ničle za vejico (pet). Šteti moraš premike vejice: šest mest v desno.
+ $5 \cdot 10^{-6}\,\text{m}$
- $5 \cdot 10^{6}\,\text{m}$
~ Število je manjše od $1$, zato je eksponent negativen. $5 \cdot 10^6$ je pet milijonov.
- $0{,}5 \cdot 10^{-5}\,\text{m}$
~ Vrednost je prava, a $a = 0{,}5$ ni med $1$ in $10$.
> Vejico premaknemo za $6$ mest v desno, da stoji za petico: $0{,}000005 = 5 \cdot 10^{-6}$.

? Koncert obišče $4 \cdot 10^4$ ljudi, vsak plača vstopnico $5 \cdot 10^1$ evrov. Kolikšen je skupni izkupiček v zapisu z desetiško potenco?
- $9 \cdot 10^5$ evrov
~ Števili $4$ in $5$ si seštel. Pri množenju ju zmnožiš: $4 \cdot 5 = 20$.
- $2 \cdot 10^5$ evrov
~ Iz $20$ si naredil $2$, eksponenta pa nisi povečal. $20 = 2 \cdot 10^1$, zato eksponent zraste za $1$.
- $20 \cdot 10^5$ evrov
~ Vrednost je prava, a $a = 20$ ni manjši od $10$. Zapiši $20 = 2 \cdot 10$.
+ $2 \cdot 10^6$ evrov
> $4 \cdot 5 = 20$ in $10^4 \cdot 10^1 = 10^5$, torej $20 \cdot 10^5 = 2 \cdot 10^6 = 2\,000\,000$ evrov.

:::simboli
a | število pred desetiško potenco | | | $1 \le a < 10$
n | eksponent desetiške potence | | | celo število; negativen pri številih, manjših od $1$
m | eksponent prve potence | | | pri množenju se eksponenta seštejeta
:::
