---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Dve zgodbi iz zdravstvenega doma:

- Bolnik dobi infuzijo. V vrečki je $500\,\mathrm{ml}$ raztopine, vsako uro izteče $40\,\mathrm{ml}$. Medicinska sestra vidi, da je v vrečki še $180\,\mathrm{ml}$. Koliko ur že teče infuzija?
- Babica dobi škatlo z $20$ tabletami in vzame $2$ na dan. Ko ji ostane $6$ tablet, mora po nov recept. Čez koliko dni bo to?

Prva govori o mililitrih in urah, druga o tabletah in dneh. A sestava je ista. Od začetne količine se vsakič odvzame enak del, na koncu ostane znano število. Neznano je, kolikokrat se je to zgodilo.

Ko to skupno idejo opaziš, obe zgodbi zapišeš z enako enačbo. Prav to je besedilna naloga: zgodbo prevedemo v enačbo, enačbo rešimo in rezultat prevedemo nazaj v zgodbo. Enačbe že znaš reševati. Tu se naučiš, kako jih iz besedila sploh dobiš.

## Razlaga

**Infuzija, rešena do konca.** Ne vemo, koliko ur teče infuzija. To število označimo z $x$ in z besedami zapišemo, kaj pomeni: $x$ je število ur, odkar infuzija teče.

V eni uri izteče $40\,\mathrm{ml}$, v $x$ urah torej $40x$ mililitrov. V vrečki ostane $500 - 40x$ mililitrov.

Sestra pa je ostanek videla na lastne oči: $180\,\mathrm{ml}$. Isto količino, ostanek v vrečki, poznamo na dva načina. Zato oba zapisa izenačimo:

$$500 - 40x = 180$$

Enačbo rešimo kot vsako drugo. Na obeh straneh odštejemo $500$: $-40x = 180 - 500$, torej $-40x = -320$ in $x = 8$.

Preizkus delamo v besedilu: v $8$ urah izteče $40 \cdot 8 = 320$ mililitrov, ostane $500 - 320 = 180$ mililitrov. Drži. Infuzija teče $8$ ur.

:::premisli
Zapiši enačbo še za babičine tablete. V čem je podobna enačbi za infuzijo in koliko je rešitev?
---
$20 - 2x = 6$, kjer je $x$ število dni. Oblika je ista: začetna količina minus (količina na enoto krat $x$) je enako ostanku. Rešitev: $-2x = -14$, $x = 7$. Preizkus: po $7$ dneh ostane $20 - 14 = 6$ tablet.
:::

**Iz enega primera do postopka.** Korake, ki smo jih naredili pri infuziji, lahko ponovimo pri vsaki besedilni nalogi:

1. **Preberi** nalogo in izpiši podatke z enotami.
2. **Izberi neznanko** in z besedami zapiši, kaj pomeni.
3. **Izrazi** druge količine z neznanko ($40x$ izteče, $500 - 40x$ ostane).
4. **Poišči količino, ki jo poznaš na dva načina**, in oba zapisa izenači. To je enačba.
5. **Reši** enačbo. Ulomke odpravi z množenjem z najmanjšim skupnim večkratnikom imenovalcev.
6. **Preizkusi** rezultat v besedilu, ne le v enačbi. Je smiseln? Čas ne more biti negativen, bolnikov ne more biti $2{,}5$.
7. **Odgovori** s celim stavkom in z enoto.

Najtežji je četrti korak. Pomagajo trije pogosti vzorci: *deli skupaj dajo celoto*, *začetek minus poraba je ostanek* in *dve poti skupaj dajo razdaljo*.

Pri prevajanju besed v znake si pomagaj s tabelo:

| v besedilu | zapis |
|---|---|
| za $5$ več kot $x$ | $x + 5$ |
| trikrat toliko kot $x$ | $3x$ |
| tretjina od $x$ | $\dfrac{x}{3}$ |
| je, znaša, ostane | $=$ |

**Gibanje: srečanje in dohitevanje.** Pri teh nalogah vedno velja: pot $=$ hitrost $\cdot$ čas, $s = v \cdot t$.

- *Srečanje:* vozili peljeta drugo proti drugemu. Do srečanja skupaj prevozita vso razdaljo $d$ med krajema: $v_1 t + v_2 t = d$.
- *Dohitevanje:* hitrejši pelje za počasnejšim, ki ima prednost $d$. Ko ga dohiti, je prevozil za $d$ več kot počasnejši: $v_1 t = d + v_2 t$.

Odpri simulacijo »Gibanje: srečanje in dohitevanje« spodaj in izberi vožnjo nasproti. Na grafu poti v odvisnosti od časa vsako vozilo nariše svojo premico. Srečanje je točka, kjer se premici sekata. Nato preklopi na dohitevanje in obema vozilom nastavi enako hitrost. Opazuj, kaj se zgodi s premicama.

:::premisli
Zakaj pri dohitevanju z enakima hitrostma ni rešitve? Kaj se zgodi z enačbo $v t = d + v t$?
---
Razdalja med voziloma se ne manjša, ker obe vozita enako hitro. V enačbi odštejemo $v t$ na obeh straneh in ostane $0 = d$. To ne drži, ker je $d > 0$, zato enačba nima rešitve. Na grafu imata premici enak smerni koeficient, sta vzporedni in se nikoli ne sekata.
:::

## Rešeni primeri

### Primer 1: dojenček raste (lažji)

Dojenček je ob rojstvu tehtal $3{,}4\,\mathrm{kg}$. V prvih mesecih je vsak mesec pridobil približno $0{,}7\,\mathrm{kg}$. Po koliko mesecih je tehtal $7{,}6\,\mathrm{kg}$?

**Podatki:** masa ob rojstvu $3{,}4\,\mathrm{kg}$, prirastek $0{,}7\,\mathrm{kg}$ na mesec, končna masa $7{,}6\,\mathrm{kg}$
**Iščemo:** število mesecev $x$

:::formula
masa ob rojstvu $+$ prirastek v $x$ mesecih $=$ končna masa:

$3{,}4 + 0{,}7x = 7{,}6$
:::

**Rešitev:**

1. Neznanka: $x$ je število mesecev.
2. V $x$ mesecih dojenček pridobi $0{,}7x$ kilogramov, zato tehta $3{,}4 + 0{,}7x$ kilogramov.
3. To maso poznamo še drugače, $7{,}6\,\mathrm{kg}$, zato zapišemo enačbo iz formule.
4. Odštejemo $3{,}4$: $0{,}7x = 4{,}2$, ker $7{,}6 - 3{,}4 = 4{,}2$.
5. Delimo z $0{,}7$: $x = 6$, ker $4{,}2 : 0{,}7 = 6$.
6. Preizkus v besedilu: $3{,}4 + 0{,}7 \cdot 6 = 7{,}6$. Drži.
7. Odgovor: dojenček je tehtal $7{,}6\,\mathrm{kg}$ po $6$ mesecih.

### Primer 2: tekočina po operaciji

Bolnik po operaciji mora piti dovolj tekočine. Zjutraj je popil tretjino vse tekočine tistega dne, popoldne četrtino, zvečer pa še $1\,\mathrm{l}$. Koliko tekočine je popil ta dan?

**Podatki:** zjutraj $\dfrac{1}{3}$ vse tekočine, popoldne $\dfrac{1}{4}$ vse tekočine, zvečer $1\,\mathrm{l}$
**Iščemo:** vso popito tekočino $x$ (v litrih)

:::formula
deli skupaj dajo celoto:

$\dfrac{x}{3} + \dfrac{x}{4} + 1 = x$
:::

**Rešitev:**

1. Neznanka: $x$ je vsa tekočina tistega dne v litrih.
2. Jutranji del je $\dfrac{x}{3}$, popoldanski $\dfrac{x}{4}$, večerni $1$. Vsota treh delov je vsa tekočina $x$.
3. Najmanjši skupni večkratnik imenovalcev $3$ in $4$ je $12$. Z njim pomnožimo **vsak** člen: $4x + 3x + 12 = 12x$.
4. Seštejemo $4x + 3x = 7x$ in dobimo $7x + 12 = 12x$. Na obeh straneh odštejemo $7x$: $12 = 5x$.
5. Delimo s $5$: $x = 2{,}4$, ker $12 : 5 = 2{,}4$.
6. Preizkus v besedilu: zjutraj $2{,}4 : 3 = 0{,}8$ litra, popoldne $2{,}4 : 4 = 0{,}6$ litra, zvečer $1$ liter. Skupaj $0{,}8 + 0{,}6 + 1 = 2{,}4$. Drži.
7. Odgovor: bolnik je ta dan popil $2{,}4\,\mathrm{l}$ tekočine.

### Primer 3: reševalci gredo naproti (težji)

Ob $14.00$ odpelje avto z bolnikom iz vasi proti bolnišnici, ki je $60\,\mathrm{km}$ daleč. Vozi s hitrostjo $60\,\mathrm{km/h}$. Iz bolnišnice mu $10$ minut pozneje pošljejo nasproti reševalno vozilo s hitrostjo $90\,\mathrm{km/h}$. Ob kateri uri se srečata in kako daleč od vasi?

**Podatki:** razdalja $d = 60\,\mathrm{km}$, hitrost avta $v_1 = 60\,\mathrm{km/h}$, hitrost reševalnega vozila $v_2 = 90\,\mathrm{km/h}$, zamik $10\,\mathrm{min}$, odhod avta ob $14.00$
**Iščemo:** uro srečanja in razdaljo mesta srečanja od vasi

:::formula
$s = v \cdot t$; pri srečanju: pot avta $+$ pot reševalcev $= d$
:::

**Rešitev:**

1. Neznanka: $t$ je čas vožnje avta do srečanja, v urah. Ker so hitrosti v km/h, tudi zamik pretvorimo v ure: $10\,\mathrm{min} = \dfrac{1}{6}\,\mathrm{h}$. Reševalci vozijo $t - \dfrac{1}{6}$ ure.
2. Poti: avto prevozi $60t$, reševalci $90\left(t - \dfrac{1}{6}\right)$ kilometrov.
3. Skupaj prevozita vso razdaljo: $60t + 90\left(t - \dfrac{1}{6}\right) = 60$.
4. Odpravimo oklepaj ($90 \cdot \dfrac{1}{6} = 15$): $60t + 90t - 15 = 60$, torej $150t = 75$ in $t = 0{,}5$.
5. Avto vozi pol ure, srečata se ob $14.30$. Do tam avto prevozi $60 \cdot 0{,}5 = 30$ kilometrov.
6. Preizkus v besedilu: reševalci vozijo $20$ minut, to je $\dfrac{1}{3}$ ure, in prevozijo $90 \cdot \dfrac{1}{3} = 30$ kilometrov. Skupaj $30 + 30 = 60$. Drži.
7. Odgovor: srečata se ob $14.30$, $30\,\mathrm{km}$ od vasi.

### Primer 4: zdaj ti – dve škatli tablet

Ana ima $38$ tablet in jih vzame $3$ na dan. Bor ima $24$ tablet in vzame $1$ na dan. Čez koliko dni bosta imela enako tablet?

**Podatki:** Ana $38$ tablet, $3$ na dan; Bor $24$ tablet, $1$ na dan
**Iščemo:** število dni $x$, po katerem imata enako tablet

:::formula
Ani ostane $38 - 3x$, Boru $24 - x$; ostanka sta enaka:

$38 - 3x = 24 - x$
:::

**Rešitev:**

1. Neznanka: $x$ je število dni.
2. Ostanek pri Ani je $38 - 3x$, pri Boru $24 - x$. Iščemo dan, ko sta ostanka enaka, zato ju izenačimo.
3. Enačbo reši sam in rezultat preizkusi v besedilu.

:::premisli
Koliko je $x$ in koliko tablet ima takrat vsak?
---
Prištejemo $3x$ in odštejemo $24$: $14 = 2x$, torej $x = 7$. Preizkus: Ana ima $38 - 21 = 17$ tablet, Bor $24 - 7 = 17$ tablet. Po $7$ dneh imata oba po $17$ tablet.
:::

## Pogoste napake

- **Neznanka brez pomena in mešane enote.** Učenec napiše »$x$ = čas« in v Primeru 3 zapiše $90(t - 10)$, ker je zamik »$10$«. Hitrost je v km/h, zamik pa v minutah, zato rezultat nima smisla. Popravek: neznanko opiši z enoto ($t$ v urah) in vse podatke pretvori v iste enote: $10\,\mathrm{min} = \dfrac{1}{6}\,\mathrm{h}$.
- **Prevajanje besedo za besedo.** »Vsako uro izteče $40\,\mathrm{ml}$, ostane $180\,\mathrm{ml}$, začetno je $500\,\mathrm{ml}$« učenec prepiše kot $40x - 500 = 180$, ker si sledijo v tem vrstnem redu. Odštevanje pa ni zamenljivo. Popravek: vprašaj se, kaj od česa odvzameš. Od začetne količine odvzameš iztečeno: $500 - 40x$.
- **Pri dohitevanju seštete hitrosti.** Učenec misli: »Oba vozita, torej $v_1 + v_2$.« Pri dohitevanju pa vozita v isto smer in se razdalja manjša le za razliko hitrosti. Popravek: nariši skico in zapiši pot vsakega posebej; enačba $v_1 t = d + v_2 t$ sama da razliko.
- **Preizkus le v enačbi.** Če je enačba napačno zapisana, rešitev zanjo vseeno »drži«. Popravek: preizkus delaj v besedilu, z dejanskimi količinami.
- **Odgovor je samo število.** V Primeru 3 je rešitev enačbe $t = 0{,}5$, vprašanje pa je »ob kateri uri«. Popravek: preberi vprašanje še enkrat in odgovori nanj, $14.30$.

## Povzetek

- Besedilno nalogo prevedemo v enačbo, jo rešimo in rezultat prevedemo nazaj v besedilo.
- Neznanko izberemo in z besedami zapišemo, kaj pomeni in v kateri enoti je.
- Enačba nastane, ko isto količino zapišemo na dva načina: deli $=$ celota, začetek $-$ poraba $=$ ostanek, pot $+$ pot $=$ razdalja.
- Gibanje: $s = v \cdot t$. Srečanje: $v_1 t + v_2 t = d$. Dohitevanje: $v_1 t = d + v_2 t$. Vse enote poenotimo (minute v ure).
- Preizkus delamo v besedilu, odgovor zapišemo s stavkom in enoto. Rešitev mora biti smiselna.

## Drugače: Z analogijo

Reševanje besedilne naloge je podobno delu zdravnika.

- **Pregled.** Zdravnik bolnika najprej posluša in zapiše simptome. Ti prebereš nalogo in izpišeš podatke.
- **Kaj iščemo.** Zdravnik ve, da išče vzrok težav. Ti veš, katero količino iščeš, in ji daš ime $x$.
- **Diagnoza.** Zdravnik iz simptomov sestavi diagnozo, eno jasno trditev. Ti iz podatkov sestaviš enačbo. To je najpomembnejši korak: napačna diagnoza pomeni napačno zdravljenje, četudi je zdravilo dobro.
- **Zdravljenje.** Zdravnik predpiše zdravilo po znanem postopku. Ti rešiš enačbo z znanimi pravili.
- **Kontrolni pregled.** Zdravnik preveri, ali je bolnik res bolje. Ti vstaviš rezultat v besedilo in preveriš, ali zgodba drži.

Kot zdravnik ne pozabi kontrolnega pregleda, tudi ti ne izpusti preizkusa. Šele ta pokaže, ali je bila diagnoza, torej enačba, pravilna.

## Drugače: Bolj natančno

Vsaka stran enačbe je opis iste količine. Če vsako stran enačbe zapišemo kot linearno funkcijo, dobimo dve premici. Pri Ani in Boru (Primer 4) sta to $y = -3x + 38$ in $y = -x + 24$. Rešitev enačbe je abscisa presečišča premic: $(7, 17)$.

Zato ima linearna enačba v besedilni nalogi lahko:

- **eno rešitev**, ko imata premici različna smerna koeficienta in se sekata;
- **nobene rešitve**, ko sta premici vzporedni ($k_1 = k_2$, $n_1 \ne n_2$), na primer pri dohitevanju z enakima hitrostma;
- **neskončno mnogo rešitev**, ko premici sovpadata. Tedaj sta obe strani le dva zapisa iste stvari.

Iz enačb za gibanje lahko izrazimo čas splošno. Pri srečanju iz $v_1 t + v_2 t = d$ izpostavimo $t$: $t = \dfrac{d}{v_1 + v_2}$. Pri dohitevanju iz $v_1 t = d + v_2 t$ dobimo $t = \dfrac{d}{v_1 - v_2}$. Formula pokaže, da je za dohitevanje potrebno $v_1 > v_2$. Pri $v_1 = v_2$ bi delili z nič.

Rešitev enačbe še ni nujno rešitev naloge. Število tablet, dni ali ljudi mora biti naravno število, čas in razdalja nenegativna. Če enačba da $x = 4{,}5$ dneva za tablete, ki jih jemljemo enkrat na dan, je treba odgovor razložiti ali pa ugotoviti, da naloga nima rešitve.

## Preveri se

? Pri infuziji smo zapisali $500 - 40x = 180$. Kaj v tej nalogi pomeni izraz $40x$?
- Koliko mililitrov ostane v vrečki.
~ Ostanek je $500 - 40x$, kar je enako $180$. Izraz $40x$ je del, ki je odtekel.
+ Koliko mililitrov izteče v $x$ urah.
- Koliko ur že teče infuzija.
~ Število ur je sama neznanka $x$, ne $40x$.
- S kolikšno hitrostjo kaplja infuzija.
~ Hitrost je $40\,\mathrm{ml}$ na uro. V $40x$ je hitrost že pomnožena s časom.
> V eni uri izteče $40\,\mathrm{ml}$, v $x$ urah $40x$ mililitrov. To odštejemo od začetnih $500\,\mathrm{ml}$.

? Kateri vrstni red korakov pri besedilni nalogi je pravilen?
- enačba, neznanka, reševanje, odgovor
~ Enačbe ne moreš zapisati, preden veš, kaj pomeni neznanka.
- neznanka, reševanje, enačba, preizkus
~ Reševati ne moremo ničesar, dokler enačba ni zapisana.
+ neznanka, izražanje količin z $x$, enačba, reševanje, preizkus v besedilu, odgovor
- neznanka, enačba, reševanje, odgovor
~ Manjka preizkus. Brez njega ne opaziš napačno zapisane enačbe.
> Najprej določimo neznanko in z njo izrazimo količine, šele nato nastane enačba. Po reševanju sledita preizkus v besedilu in odgovor.

? V Primeru 3 bi reševalno vozilo odpeljalo ob isti uri kot avto, ne $10$ minut pozneje. Kaj se zgodi s časom srečanja?
- Srečala bi se pozneje, ker bi reševalci prevozili večji del poti.
~ Reševalci bi res prevozili več, a prav zato bi se srečala prej, ne pozneje.
- Čas srečanja bi ostal enak, ker se hitrosti ne spremenita.
~ Hitrosti se res ne spremenita. A če bi se srečala ob isti uri, bi reševalci vozili $10$ minut dlje, prevozili $15\,\mathrm{km}$ več in skupaj bi prevozila več kot $60\,\mathrm{km}$.
+ Srečala bi se prej, po $24$ minutah, ker je $60t + 90t = 60$ in $t = 0{,}4\,\mathrm{h}$.
- Ne bi se srečala, ker vozita nasproti.
~ Prav ker vozita nasproti, se srečata. Ne srečata se lahko le pri dohitevanju z enakima hitrostma.
> Brez zamika je $150t = 60$, $t = 0{,}4\,\mathrm{h} = 24\,\mathrm{min}$, kar je manj kot $30$ minut.

? V vrečki je $1000\,\mathrm{ml}$ infuzije, vsako uro izteče $125\,\mathrm{ml}$. Po koliko urah ostane v vrečki $250\,\mathrm{ml}$?
- $8$ ur
~ Toliko časa bi trajalo, da se vrečka popolnoma izprazni ($1000 : 125$). V njej pa naj ostane $250\,\mathrm{ml}$.
- $2$ uri
~ To je $250 : 125$. Ostanek ni količina, ki je iztekla.
+ $6$ ur
- $10$ ur
~ Ostanek je bil prištet namesto odštet: $(1000 + 250) : 125$.
> $1000 - 125x = 250$, $-125x = -750$, $x = 6$. Preizkus: $1000 - 125 \cdot 6 = 250$.

? Kurir s krvnimi vzorci odpelje iz bolnišnice s hitrostjo $40\,\mathrm{km/h}$. Pol ure pozneje za njim odpelje avto s hitrostjo $60\,\mathrm{km/h}$. Koliko časa po svojem odhodu ga avto dohiti?
- $0{,}2\,\mathrm{h}$
~ Hitrosti sta sešteti kot pri srečanju. Pri dohitevanju se razdalja manjša le za razliko $60 - 40 = 20\,\mathrm{km/h}$.
- $0{,}5\,\mathrm{h}$
~ To je zamik, ne čas dohitevanja.
+ $1\,\mathrm{h}$
- $1{,}5\,\mathrm{h}$
~ To je čas vožnje kurirja, $t + 0{,}5$. Vprašanje je, koliko vozi avto.
> Avto vozi $t$ ur, kurir $t + 0{,}5$ ure. Prevozita enako pot: $60t = 40(t + 0{,}5)$; $20t = 20$; $t = 1\,\mathrm{h}$. Oba sta takrat $60\,\mathrm{km}$ od bolnišnice.

:::simboli
x | neznanka | | | zapiši, kaj pomeni in v kateri enoti
s | pot | s = v \cdot t | km
v | hitrost | | km/h
v_1, v_2 | hitrosti obeh vozil | | km/h
t | čas vožnje | | h
d | razdalja med krajema | | km | pri dohitevanju prednost počasnejšega vozila
:::
