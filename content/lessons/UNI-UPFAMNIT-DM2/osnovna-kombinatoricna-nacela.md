---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Odpri vremensko napoved za naslednjih $7$ dni. Za vsak dan si zapiši en simbol: sonce (S), oblak (O) ali dež (D). Dobiš zaporedje, na primer S S O D D O S. Zdaj si zastavi dve vprašanji.

- Koliko različnih takih tedenskih zapisov sploh obstaja?
- Ali se v tvojem zapisu kateri simbol pojavi vsaj trikrat? Ali bi se temu lahko izognil?

Na prvo bi lahko odgovoril tako, da vse zapise izpišeš. Hitro bi obupal, saj jih je več kot dva tisoč. Na drugo boš verjetno odgovoril »ja«, a ne boš vedel, ali je to naključje. Štiri preprosta načela odgovorita na obe vprašanji brez izpisovanja. Na njih stoji vsa kombinatorika, ki sledi, od načela vključitve in izključitve do rodovnih funkcij.

## Razlaga

Začnimo z majhnimi primeri in iščimo vzorec.

**En dan.** Možni zapisi so S, O, D. To so $3$ možnosti.

**Dva dneva.** Za vsak simbol prvega dne je na voljo vsak simbol drugega dne:

| 1. dan \ 2. dan | S | O | D |
|---|---|---|---|
| S | SS | SO | SD |
| O | OS | OO | OD |
| D | DS | DO | DD |

Tabela ima $3$ vrstice in $3$ stolpce, torej $3 \cdot 3 = 9$ zapisov.

**Trije dnevi.** Vsakega od $9$ dvodnevnih zapisov podaljšamo na $3$ načine: $9 \cdot 3 = 27$.

:::premisli
Napovej, koliko je zapisov za $4$ dni, še preden kaj izpišeš. Kaj pa za ves teden?
---
Vsak nov dan pomnoži število zapisov s $3$: za $4$ dni jih je $3^4 = 81$, za $7$ dni $3^7 = 2187$. Odgovor na prvo vprašanje iz uvoda je torej $2187$.
:::

**Načelo produkta.** Vzorec se ne veže na vreme. Če izbiro naredimo v dveh zaporednih korakih in ima prvi korak $m$ izidov, drugi pa pri *vsakem* izidu prvega $n$ izidov, je vseh izbir $m \cdot n$. V jeziku množic: $|A \times B| = |A| \cdot |B|$. Pri $k$ korakih se števila zmnožijo; za zaporedja dolžine $k$ iz $n$ simbolov dobimo $n^k$.

**Načelo vsote.** Drugačen položaj: ornitolog bo danes fotografiral eno samo žival, bodisi eno od $4$ vrst ptic na krmilnici bodisi eno od $3$ vrst metuljev na vrtu. Tu ni dveh korakov, ampak izbira med dvema ločenima skupinama. Možnosti je $4 + 3 = 7$. Splošno: če sta množici $A$ in $B$ **disjunktni** (brez skupnega elementa), je $|A \cup B| = |A| + |B|$. Ključna beseda je »ali«; pri produktu je »in nato«.

**Dvojno preštevanje.** Vremenska služba ima tabelo: vrstice so postaje, stolpci merjene količine (temperatura, veter, vlaga …). Križec pomeni, da postaja to količino meri. Število križcev lahko preštejemo po vrsticah ali po stolpcih. Rezultat mora biti enak, ker štejemo iste križce:
$$\sum_{\text{postaje}} (\text{število količin postaje}) = \sum_{\text{količine}} (\text{število postaj, ki jo merijo}).$$
To je **dvojno preštevanje**: isto množico parov preštejemo na dva načina in izenačimo. Iz grafov že poznaš en primer. Vsota stopenj vseh vozlišč šteje pare (vozlišče, povezava), pri katerih se povezava dotika vozlišča. Vsaka povezava ima dve krajišči, zato je vsota stopenj enaka $2|E|$.

**Ponovitve.** Nazaj k drugemu vprašanju iz uvoda. Poskusi sestaviti teden, v katerem se nobeden od treh simbolov ne pojavi več kot dvakrat. Največ lahko porabiš $3 \cdot 2 = 6$ dni, sedmi dan pa mora ponoviti enega od simbolov že tretjič. Iskanje se ne izide, in ne po naključju.

:::premisli
Koliko dni bi moral opazovati, da bi bil zagotovo kateri simbol vsaj štirikrat?
---
$10$ dni. V $9$ dneh se lahko vsak simbol pojavi natanko trikrat ($3 \cdot 3 = 9$), deseti dan pa prinese četrto ponovitev.
:::

**Dirichletovo načelo** (tudi *načelo golobnjaka*: če je golobov več kot luknjic, si dva delita luknjico). Če $n$ predmetov razporedimo v $k$ predalov in je $n > k$, sta v nekem predalu vsaj dva predmeta. Splošneje: v nekem predalu je vsaj $\left\lceil \frac{n}{k} \right\rceil$ predmetov. Dokaz je en sam protislovni korak: če bi bilo v vsakem predalu največ $\left\lceil \frac{n}{k} \right\rceil - 1$ predmetov, bi jih bilo skupaj največ $k\left(\left\lceil \frac{n}{k} \right\rceil - 1\right)$, kar je manj kot $k \cdot \frac{n}{k} = n$. Načelo pove, *da* tak predal obstaja, ne pa, *kateri* je.

## Rešeni primeri

### Primer 1 (lažji): poti na vrh

Do planinske koče vodijo $3$ poti iz zahodne doline in $2$ poti iz vzhodne doline. Od koče do vrha vodijo $4$ poti. Na koliko načinov lahko planinec pride iz ene od dolin prek koče na vrh?

**Podatki:** $3$ poti iz zahodne doline, $2$ poti iz vzhodne doline, $4$ poti od koče do vrha
**Iščemo:** število vseh poti od doline do vrha

:::formula
Načelo vsote za izbiro med disjunktnima skupinama, nato načelo produkta za zaporedna koraka: $(m_1 + m_2) \cdot n$
:::

**Rešitev:**

1. Do koče: pot je iz zahodne *ali* vzhodne doline, skupini sta disjunktni, zato $3 + 2 = 5$ načinov.
2. Od koče na vrh: pri vsaki poti do koče so na voljo $4$ nadaljevanja.
3. Skupaj po načelu produkta: $5 \cdot 4 = 20$.
4. Odgovor: planinec ima $20$ različnih poti.

### Primer 2: leto vremena

Vremenska služba vsak dan leta s $365$ dnevi uvrsti v eno od $4$ kategorij: jasno, delno oblačno, oblačno, padavine. Dokaži, da se neka kategorija pojavi vsaj $92$-krat.

**Podatki:** $n = 365$ dni (predmeti), $k = 4$ kategorije (predali)
**Iščemo:** največje število dni, ki ga neka kategorija zagotovo doseže

:::formula
Posplošeno Dirichletovo načelo: v nekem predalu je vsaj $\left\lceil \frac{n}{k} \right\rceil$ predmetov.
:::

**Rešitev:**

1. Dnevi so predmeti, kategorije so predali.
2. $\frac{365}{4} = 91{,}25$, zato $\left\lceil \frac{365}{4} \right\rceil = 92$.
3. Preverimo s protislovjem: če bi imela vsaka kategorija največ $91$ dni, bi bilo vseh dni največ $4 \cdot 91 = 364$, leto pa jih ima $365$.
4. Odgovor: vsaj ena kategorija se pojavi vsaj $92$-krat. Katera, načelo ne pove.

### Primer 3 (težji): mreža postaj

Inženir želi $9$ vremenskih postaj povezati z radijskimi zvezami tako, da je vsaka postaja neposredno povezana z natanko $3$ drugimi. Ali je to mogoče? Če ne, koliko zvez bi potreboval pri $10$ postajah z istim pogojem?

**Podatki:** $9$ postaj, vsaka stopnje $3$; v drugem delu $10$ postaj, vsaka stopnje $3$
**Iščemo:** ali tak graf na $9$ vozliščih obstaja; število povezav $|E|$ pri $10$ vozliščih

:::formula
Dvojno preštevanje parov (postaja, zveza): $\sum_v \deg v = 2|E|$
:::

**Rešitev:**

1. Postaje so vozlišča, zveze povezave. Vsota stopenj pri $9$ postajah: $9 \cdot 3 = 27$.
2. Ta vsota mora biti $2|E|$, torej soda. Število $27$ je liho, zato bi bilo $|E| = 13{,}5$, kar ni mogoče.
3. Pri $10$ postajah je vsota stopenj $10 \cdot 3 = 30$, torej $|E| = \frac{30}{2} = 15$.
4. Odgovor: pri $9$ postajah takšna mreža ne obstaja; pri $10$ postajah potrebuje $15$ zvez (taka mreža obstaja, na primer Petersenov graf).

### Primer 4: zdaj ti

V mreži je $12$ vremenskih postaj. Vsaka meri natanko $5$ različnih količin, vsako količino pa meri natanko $6$ postaj. Koliko različnih količin merijo postaje skupaj?

**Podatki:** $12$ postaj, $5$ količin na postajo, $6$ postaj na količino
**Iščemo:** število količin $q$

:::formula
Dvojno preštevanje križcev v tabeli postaje × količine: vsota po vrsticah je enaka vsoti po stolpcih.
:::

**Rešitev:**

1. Po vrsticah (postajah): $12 \cdot 5 = 60$ križcev.
2. Po stolpcih (količinah): vsak od $q$ stolpcev ima $6$ križcev, skupaj $6q$.
3. Izenači in izračunaj $q$ sam.

:::premisli
Koliko količin merijo postaje?
---
$6q = 60$, torej $q = 10$ količin.
:::

## Pogoste napake

- **»Ali« in »in nato« se zamešata.** Pri poteh na vrh nekdo izračuna $3 + 2 + 4 = 9$, ker »sešteje vse poti«. Do vrha pa vodita dva zaporedna koraka, zato se izbiri zmnožita. Vprašaj se: izbiram eno stvar iz več skupin (vsota) ali naredim več zaporednih izbir (produkt)?
- **Vsota pri skupinah, ki se prekrivajo.** Če je $10$ vrst ptic selivk in $8$ vrst ptic ob vodi, vseh vrst ni nujno $18$: vrsta, ki je oboje, je šteta dvakrat. Načelo vsote velja le za disjunktne množice; za prekrivanje pride načelo vključitve in izključitve.
- **Pri dvojnem preštevanju pozabimo deliti.** Iz »$9$ postaj, vsaka s $3$ zvezami« nekdo sklepa, da je zvez $27$. Vsako zvezo smo pri tem šteli z obeh koncev. Pravilno je $|E| = \frac{1}{2}\sum \deg v$.
- **Dirichlet z $n = k$.** »Ker je $12$ mesecev, sta med $12$ ljudmi dva rojena v istem mesecu.« Ne nujno: vsak je lahko v svojem mesecu. Zagotovilo dobiš šele pri $13$ ljudeh, ko je predmetov več kot predalov.
- **Spodnji namesto zgornjega celega dela.** V primeru z letom vremena nekdo zapiše $\left\lfloor \frac{365}{4} \right\rfloor = 91$. To je premalo, ker $4 \cdot 91$ še ne porabi vseh dni. Pravilno je $\left\lceil \frac{n}{k} \right\rceil$.

## Povzetek

- Načelo vsote: za disjunktni $A$, $B$ velja $|A \cup B| = |A| + |B|$ (izbira »ali«).
- Načelo produkta: $|A \times B| = |A| \cdot |B|$; zaporedij dolžine $k$ iz $n$ simbolov je $n^k$ (izbira »in nato«).
- Dvojno preštevanje: isto množico parov preštejemo na dva načina in izenačimo; v grafu $\sum_v \deg v = 2|E|$.
- Dirichletovo načelo: $n$ predmetov v $k$ predalih, neki predal ima vsaj $\left\lceil \frac{n}{k} \right\rceil$ predmetov; za ponovitev mora biti $n > k$.
- Načela povedo, koliko je možnosti ali da nekaj obstaja, brez izpisovanja vseh primerov.

## Drugače: Korak za korakom s številkami

Vzemimo nalogo: koliko gesel za dostop do vremenske postaje ima $2$ ali $3$ znake, kjer je vsak znak ena od $10$ števk?

1. Razdeli na disjunktne primere po dolžini: gesla z $2$ znakoma in gesla s $3$ znaki. Nobeno geslo ni v obeh skupinah.
2. Dva znaka: prvi znak $10$ možnosti, drugi znak $10$ možnosti, po produktu $10 \cdot 10 = 100$.
3. Trije znaki: $10 \cdot 10 \cdot 10 = 1000$.
4. Primera združi po vsoti: $100 + 1000 = 1100$.
5. Preizkus z Dirichletom: če $1101$ postaj dobi gesla, imata zagotovo dve enako geslo, ker je $1101 > 1100$.

V eni nalogi so se tako zvrstila tri načela, vsako na svojem koraku.

## Drugače: Kot zgodba

Maja začne pripravništvo na meteorološki postaji. Prvi dan ji vodja reče: »Preveri, ali imamo v arhivu vse možne tedenske vzorce vremena.« Maja začne izpisovati SSSSSSS, SSSSSSO … in po petdesetih vrsticah ugotovi, da jih bo $3^7 = 2187$. Načelo produkta ji prihrani teden dela.

Drugi dan dobi tabelo $12$ postaj in vprašanje, koliko količin merijo. Tabela je raztrgana, vidi samo, da ima vsaka postaja $5$ križcev in vsak stolpec $6$. Maja prešteje križce po vrsticah ($60$), deli s $6$ in pove: $10$ količin. Dvojno preštevanje.

Tretji dan vodja trdi, da je bilo lani vsako od štirih vrst vremena približno enako pogosto, »vsaka nekje do $90$ dni«. Maja se nasmehne: $4 \cdot 90 = 360 < 365$, torej je vsaj ena vrsta imela več kot $90$ dni. Ker je tudi $4 \cdot 91 = 364$ premalo, je ena vrsta zagotovo imela vsaj $92$ dni. Dirichlet ji je pomagal, ne da bi odprla arhiv.

## Drugače: Bolj natančno

- **Produkt.** Preslikava $A \times B \to \{1, \dots, |A| \cdot |B|\}$, $(a_i, b_j) \mapsto (i - 1)|B| + j$, je bijekcija; od tod $|A \times B| = |A| \cdot |B|$. Za $k$ množic sledi z indukcijo po $k$.
- **Vsota.** Za disjunktni $A$, $B$ je $|A \cup B| = |A| + |B|$ neposredno iz definicije moči končne množice; za $A_1, \dots, A_k$, ki so paroma disjunktne, z indukcijo.
- **Dvojno preštevanje.** Za relacijo $R \subseteq X \times Y$ velja $\sum_{x \in X} |\{y : (x, y) \in R\}| = |R| = \sum_{y \in Y} |\{x : (x, y) \in R\}|$. Primer identitete: izbira $k$-članskega odbora s predsednikom iz $n$ ljudi da $k\binom{n}{k} = n\binom{n-1}{k-1}$ (najprej odbor, nato predsednik, ali najprej predsednik, nato ostali člani).
- **Dirichlet.** Če je $f\colon N \to K$ preslikava končnih množic in $|N| > |K|$, $f$ ni injektivna. Posplošitev: obstaja $y \in K$ z $|f^{-1}(y)| \ge \left\lceil \frac{|N|}{|K|} \right\rceil$, sicer bi bilo $|N| = \sum_y |f^{-1}(y)| < |N|$.

## Preveri se

? Za dva dneva beležimo samo sonce (S) ali dež (D). Kateri seznam ustreza vsem možnim zapisom?
- SS, SD, DD
~ Manjka DS. Zapis »sonce, nato dež« ni isti kot »dež, nato sonce«, ker sta dneva različna.
+ SS, SD, DS, DD
- S, D
~ To so možnosti za en dan. Pri dveh dneh vsak simbol prvega dne kombiniramo z vsakim simbolom drugega.
> Po načelu produkta je zapisov $2 \cdot 2 = 4$, kar je natanko ta seznam.

? Približno koliko je različnih zapisov vremena za $30$ dni, če vsak dan beležimo enega od $3$ simbolov?
- Približno $90$.
~ To je $3 \cdot 30$, kot da bi števila seštevali. Dnevi so zaporedni koraki, zato se možnosti množijo.
- Približno $27\,000$.
~ To je $30^3$, osnova in eksponent sta zamenjana. Simbolov je $3$, korakov $30$.
+ Približno $2 \cdot 10^{14}$.
> $3^{30} \approx 2{,}06 \cdot 10^{14}$: vsak od $30$ dni pomnoži število možnosti s $3$.

? V gozdu raste $50\,000$ dreves, nobeno nima več kot $40\,000$ listov. Zakaj imata zagotovo vsaj dve drevesi enako število listov?
- Ker je dreves več kot $40\,000$, je vsaj eno drevo brez listov.
~ Načelo ne pove nič o tem, katera števila se pojavijo; tudi vsa drevesa imajo lahko liste.
+ Ker je možnih števil listov $40\,001$ (od $0$ do $40\,000$), dreves pa več, zato se neko število ponovi.
- Ker v naravi drevesa iste vrste vedno rastejo enako.
~ Sklep je čisto kombinatoričen in ne potrebuje predpostavk o rasti dreves.
> Drevesa so predmeti, možna števila listov predali. Ker je $50\,000 > 40\,001$, Dirichletovo načelo zagotovi predal z vsaj dvema drevesoma.

? Koliko ljudi moraš najmanj zbrati, da so zagotovo vsaj trije rojeni v istem letnem času?
- $8$
~ Pri $8$ ljudeh sta lahko v vsakem od $4$ letnih časov natanko po dva. Potreben je še eden.
+ $9$
- $12$
~ To je $3 \cdot 4$. Toliko jih zagotovi trojico, a ni najmanjše število.
> Z $8$ ljudmi lahko vsak letni čas dobi po dva; deveti ustvari trojico. Res: $\left\lceil \frac{9}{4} \right\rceil = 3$.

? V ekosistemu opazujemo $7$ vrst. Biolog trdi, da je vsaka vrsta v prehranjevalnem spletu neposredno povezana z natanko $5$ drugimi. Kaj lahko rečeš?
- Spletu ustreza graf s $35$ povezavami.
~ Pozabil si deliti z $2$: vsaka povezava ima dve krajišči in je v vsoti stopenj šteta dvakrat.
- Spletu ustreza graf s $17{,}5$ povezavami.
~ Število povezav mora biti celo. Ta rezultat pove, da tak graf ne obstaja.
+ Trditev ne more biti res.
> Vsota stopenj je $7 \cdot 5 = 35$ in je liha, vsota stopenj pa je vedno $2|E|$, torej soda. Takega grafa ni.

:::simboli
m_1, m_2 | števili izidov v disjunktnih skupinah | | | npr. poti iz zahodne in vzhodne doline
n | število izidov drugega koraka | | | pri Dirichletovem načelu število predmetov
k | število predalov | | | pri načelu produkta število korakov
v | vozlišče grafa
E | množica povezav grafa | | | število povezav je moč množice E
:::
