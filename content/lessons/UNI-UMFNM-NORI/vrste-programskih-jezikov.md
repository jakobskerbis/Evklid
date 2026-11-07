---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V delavnici rezka CNC-stroj jekleno ploščo. Njegov program je zaporedje vrstic, kot je `G1 X120 Y80 F300`: premakni orodje naravnost v točko $(120, 80)$ s podajanjem $300\,\mathrm{mm/min}$. Stroj ne ve, kaj je »utor« ali »luknja«; pozna le premike. Nekaj nadstropij više inženirka v preglednici materialov napiše poizvedbo »poišči vsa jekla z mejo tečenja nad $300\,\mathrm{MPa}$ in jih uredi po ceni«. Ne pove, *kako* naj računalnik išče; pove le, *kaj* želi.

Obe situaciji skrivata isto zgradbo: navodilo stroju je lahko zapisano zelo blizu temu, kar stroj neposredno izvede, ali zelo blizu temu, kar človek želi. Vmes je več stopenj. Programski jeziki so razporejeni po isti lestvici, od ničel in enic, ki jih razume procesor, do jezikov, v katerih opišeš le želeni rezultat.

Ko izbiraš jezik za nalogo (krmiljenje merilne naprave, obdelavo meritev, bazo vzorcev), izbiraš stopnjo na tej lestvici. Spodaj boš spoznal:

- kaj so **strojni jezik**, **zbirni jezik**, **višji jeziki** in **jeziki četrte generacije**,
- kako program pride do procesorja: **zbirnik**, **prevajalnik**, **tolmač**,
- kaj na vsaki stopnji pridobiš in kaj izgubiš (hitrost, nadzor, prenosljivost, hitrost pisanja).

## Razlaga

**Lestvica jezikov.** Najprej slika. Spodaj je procesor, više je vse bližje človeku:

```
 5. gen. Prolog   pravila, logika
 4. gen. SQL      KAJ želim
 3. gen. C, Java  KAKO, berljivo
 2. gen. ADD 13   zbirni jezik
 1. gen. 00101101 strojni jezik
 --------------------------------
          PROCESOR
```

Vsaka stopnja skrije podrobnosti spodnje. Ena vrstica na višji stopnji pomeni veliko vrstic na nižji. Lestvico bomo zdaj prehodili od spodaj navzgor na istem drobnem računu.

**Učni procesor.** Da bomo videli prave ukaze, si zamislimo preprost procesor. Ima en register **akumulator** (ACC), v katerem računa, in pomnilnik s $16$ celicami z naslovi od $0$ do $15$. Vsak ukaz je dolg $8$ bitov: zgornji $4$ biti so **operacijska koda** (kaj narediti), spodnji $4$ biti so **naslov** celice. Vsaka celica hrani $16$ bitov: ukaz zasede spodnjih $8$, podatek pa je celo število od $-32\,768$ do $32\,767$.

- `0001` LOAD $a$: v ACC naloži vsebino celice $a$
- `0010` ADD $a$: ACC poveča za vsebino celice $a$
- `0011` SUB $a$: od ACC odšteje vsebino celice $a$
- `0100` STORE $a$: ACC shrani v celico $a$
- `0101` JZ $a$: skoči na ukaz $a$, če je ACC $= 0$
- `0110` JMP $a$: vedno skoči na ukaz $a$
- `0111` JN $a$: skoči na ukaz $a$, če je ACC $< 0$
- `0000` HALT: ustavi se

Ukazi se izvajajo po vrsti od naslova $0$, razen ko skok določi drugače. Program in podatki so v istem pomnilniku; to je **von Neumannova zgradba**, ki jo imajo skoraj vsi današnji računalniki.

**1. Strojni jezik (1. generacija).** **Definicija.** Strojni jezik je množica ukazov, ki jih procesor izvaja neposredno, zapisanih kot dvojiška števila. Vsaka družina procesorjev (x86 v prenosnikih, ARM v telefonih) ima svoj nabor ukazov, angl. *instruction set*. Program, ki iz celic $13$ in $14$ sešteje dolžini dveh palic in shrani vsoto v celico $12$, je v strojnem jeziku:

```
0001 1101
0010 1110
0100 1100
0000 0000
```

Z dvojiškim zapisom iz prejšnje lekcije ga beremo: `0001` je LOAD, `1101` je $13$. Krajše ga zapišemo šestnajstiško: `1D 2E 4C 00`. Procesor nič drugega ne razume.

*Preizkus:* koliko različnih operacijskih kod omogočajo $4$ biti? ($2^4 = 16$; uporabljamo jih $8$.)

**2. Zbirni jezik (2. generacija).** **Definicija.** Zbirni jezik (angl. *assembly*) je strojni jezik, zapisan s kratkimi besednimi oznakami ukazov (**mnemoniki**: LOAD, ADD) in z imeni namesto številk. Isti program:

```
LOAD 13   ; ACC = palica 1
ADD 14    ; ACC = ACC + palica 2
STORE 12  ; vsota v celico 12
HALT
```

Program, ki zbirni zapis prevede v strojno kodo, je **zbirnik** (angl. *assembler*). Bistveno je razmerje **ena proti ena**: vsaka vrstica je natanko en strojni ukaz. Zato je zbirni jezik vezan na eno družino procesorjev, tako kot strojni. Programer ima popoln nadzor nad registri in pomnilnikom, zato ga še danes uporabljamo za najbolj kritične dele: zagon računalnika, gonilnike, mikrokrmilnike v senzorjih.

*Preizkus:* ali lahko isti zbirni program brez sprememb teče na procesorju ARM in x86? (Ne: imata različne ukaze in registre.)

**3. Višji jeziki (3. generacija).** **Definicija.** Višji programski jezik je neodvisen od procesorja in uporablja zapise, blizu matematiki in naravnemu jeziku: spremenljivke z imeni, izraze, pogoje, zanke, funkcije. Isti račun v C ali Pythonu je ena vrstica:

```
dolzina = palica1 + palica2
```

En stavek višjega jezika se prevede v več strojnih ukazov. Ker jezik ni vezan na procesor, je program **prenosljiv** na ravni izvorne kode: za vsak procesor ga prevedemo posebej. Sem spadajo Fortran (1957, prvi razširjen višji jezik, za znanstveno računanje), C, C++, Java, C#, Python, JavaScript.

Do procesorja pride višji jezik na dva načina.

- **Prevajalnik** (angl. *compiler*) prebere ves izvorni program in ga **vnaprej** prevede v strojno kodo; nastane izvršljiva datoteka, ki teče brez prevajalnika. Primer: C, C++, Fortran. Napake v zapisu javi, še preden program teče.
- **Tolmač** (angl. *interpreter*) bere program **sproti**, stavek za stavkom, in vsakega takoj izvede. Ni ločene izvršljive datoteke; tolmač mora biti na računalniku. Primer: Python, JavaScript, bash.

Pogosta je vmesna pot: Java in C# se prevedeta v **vmesno (bajtno) kodo** za navidezni stroj, ta pa jo med izvajanjem sproti prevaja v strojno kodo (prevajanje **JIT**, angl. *just in time*). Bajtna koda je prenosljiva že kot datoteka.

:::premisli
Zakaj prevedeni program v C pri dolgi zanki z milijoni ponovitev praviloma teče hitreje kot enak program, ki ga izvaja tolmač?
---
Prevajalnik delo prevajanja opravi enkrat, vnaprej, in pri tem kodo še optimizira. Tolmač mora vsak stavek v zanki pri vsaki ponovitvi znova prebrati in razčleniti, kar je dodatno delo ob samem računu. Pri milijon ponovitvah se ta režija nabere.
:::

Višje jezike delimo še po **slogu** (paradigmi): **proceduralni** (zaporedje ukazov in funkcij, C), **objektni** (podatki in postopki skupaj v objektih, Java), **funkcijski** (računanje kot sestavljanje funkcij, Haskell). Vsi pa so **imperativni**: programer opiše, *kako* priti do rezultata.

**4. Jeziki četrte generacije.** **Definicija.** Jeziki 4. generacije (4GL) so namenjeni določenemu področju in so **deklarativni**: opišeš, *kaj* želiš, sistem sam izbere *kako*. Najbolj znan je SQL za podatkovne baze:

```
SELECT ime FROM materiali
WHERE meja_tecenja > 300
ORDER BY cena;
```

Ne pišemo zanke čez vrstice, ne odločamo o vrstnem redu iskanja: sistem za upravljanje baze sam izbere postopek, npr. uporabi kazalo (indeks). Med 4GL štejemo tudi generatorje poročil in obrazcev ter jezike za statistiko in matematiko na visoki ravni (formula v preglednici, ukaz za regresijo v statističnem paketu). Cena za udobje: jezik je dober le na svojem področju; splošnega programa (gonilnika, igre) v SQL ne napišeš.

**5. generacija** se navadno imenuje logično programiranje (Prolog): podaš dejstva in pravila, sistem sam išče rešitev. Ta delitev na generacije je zgodovinska in ni ostra; Python ima na primer tudi deklarativne prvine.

:::premisli
Inženirka mora na mikrokrmilniku v merilni celici $10\,000$-krat na sekundo prebrati senzor in odziv krmiliti v natanko določenem času. Druga mora iz baze $50\,000$ preizkusov izbrati vzorce, ki so počili pod $200\,\mathrm{MPa}$. Katero stopnjo lestvice izbereš za vsako nalogo in zakaj?
---
Prva naloga potrebuje popoln nadzor nad časom in strojno opremo: C, ki se prevede v strojno kodo, in pri najbolj kritičnem delu celo zbirni jezik. Druga je poizvedba po podatkih, ki jo SQL opiše v eni vrstici, sistem baze pa jo izvede učinkovito; pisanje zanke v nižjem jeziku bi bilo počasnejše za pisanje in bolj podvrženo napakam.
:::

**Kaj pridobimo in izgubimo.** Primerjava po stopnjah (»+« pomeni prednost):

| stopnja | hitrost, nadzor | pisanje, prenos |
|---|---|---|
| strojni | $+ + +$ | $-$ |
| zbirni | $+ + +$ | $-$ |
| višji | $+ +$ | $+ +$ |
| 4GL | $+$ | $+ + +$ |

Navzgor raste **abstrakcija**: manj vrstic, manj napak, prenosljivost. Navzdol raste **nadzor** nad strojem.

## Rešeni primeri

### Primer 1 (lažji)

Dve jekleni palici z dolžinama $600\,\mathrm{cm}$ in $450\,\mathrm{cm}$ zvarimo s prekrivanjem $30\,\mathrm{cm}$. Dolžine so v celicah $13$, $14$ in $15$ učnega procesorja. Napiši program v zbirnem jeziku, ki v celico $12$ zapiše dolžino zvarjene palice, in ga prevedi v strojno kodo (dvojiško in šestnajstiško).

**Podatki:** $L_1 = 600\,\mathrm{cm}$ v celici $13$, $L_2 = 450\,\mathrm{cm}$ v celici $14$, prekrivanje $p = 30\,\mathrm{cm}$ v celici $15$, rezultat v celico $12$; ukaz = $4$ biti koda + $4$ biti naslov
**Iščemo:** zbirni program, strojno kodo, vrednost v celici $12$

:::formula
$L = L_1 + L_2 - p$. Kode: LOAD `0001`, ADD `0010`, SUB `0011`, STORE `0100`, HALT `0000`.
:::

**Rešitev:**

1. Račun razstavimo na korake, ki jih procesor zna: naloži $L_1$, prištej $L_2$, odštej $p$, shrani.
2. Zbirni program: `LOAD 13`, `ADD 14`, `SUB 15`, `STORE 12`, `HALT`.
3. Naslove zapišemo dvojiško: $13 = 1101_2$, $14 = 1110_2$, $15 = 1111_2$, $12 = 1100_2$.
4. Strojna koda: `0001 1101`, `0010 1110`, `0011 1111`, `0100 1100`, `0000 0000`.
5. Vsako četverico bitov zapišemo z eno šestnajstiško števko: `1D 2E 3F 4C 00`.
6. Izvajanje: ACC $= 600$, nato $600 + 450 = 1050$, nato $1050 - 30 = 1020$; to se shrani.
7. Odgovor: program ima $5$ ukazov (`1D 2E 3F 4C 00`), v celici $12$ je $1020$, zvarjena palica je dolga $1020\,\mathrm{cm}$.

### Primer 2

V pomnilniku učnega procesorja je od naslova $0$ naprej strojna koda `1D 2D 2E 2E 4F 00`. V celici $13$ je $120$, v celici $14$ pa $80$ (stranici pravokotne pločevine v milimetrih). Razberi zbirni program, sledi vrednosti ACC in povej, kaj program izračuna.

**Podatki:** strojna koda `1D 2D 2E 2E 4F 00`, $M[13] = 120$, $M[14] = 80$ (v mm)
**Iščemo:** zbirni zapis, vrednosti ACC, pomen rezultata

:::formula
Prva šestnajstiška števka je operacijska koda, druga naslov; `1` LOAD, `2` ADD, `4` STORE, `0` HALT; $\mathrm{D} = 13$, $\mathrm{E} = 14$, $\mathrm{F} = 15$.
:::

**Rešitev:**

1. Razstavimo (angl. *disassemble*): `1D` = LOAD 13, `2D` = ADD 13, `2E` = ADD 14, `2E` = ADD 14, `4F` = STORE 15, `00` = HALT.
2. ACC po vrsti: po LOAD $120$, po prvem ADD $120 + 120 = 240$.
3. Po drugem ADD $240 + 80 = 320$, po tretjem $320 + 80 = 400$.
4. STORE zapiše $400$ v celico $15$; HALT ustavi procesor.
5. Program računa $2a + 2b$, torej obseg pravokotnika s stranicama $a$ in $b$.
6. Odgovor: obseg pločevine je $400\,\mathrm{mm}$, zapisan v celici $15$. V višjem jeziku bi bila to ena vrstica `obseg = 2*a + 2*b`; učni procesor nima množenja, zato je zbirnik dvakrat prištel isto celico.

### Primer 3 (težji)

Skladišče ima $n$ enakih jeklenih plošč z maso $m$. Učni procesor nima ukaza za množenje. (a) Napiši zbirni program, ki izračuna skupno maso $S = n \cdot m$ z zanko. Celice: $12$: $n$, $13$: $m$, $14$: $S$ (na začetku $0$), $15$: konstanta $1$. (b) Prevedi ga v strojno kodo. (c) Koliko ukazov procesor izvede pri $n = 3$ in koliko pri $n = 1000$? (d) Zapiši isti račun v višjem jeziku in v SQL, če so plošče vrstice tabele `plosce` s stolpcem `masa`.

**Podatki:** $M[12] = n$, $M[13] = m$, $M[14] = 0$, $M[15] = 1$; ukazi LOAD, ADD, SUB, STORE, JZ, JMP, HALT; $n = 3$ in $n = 1000$
**Iščemo:** zbirni program, strojno kodo, število izvedenih ukazov, zapis na višjih stopnjah

:::formula
Zanka: dokler $n \ne 0$, prištej $m$ k $S$ in zmanjšaj $n$ za $1$. Kode: JZ `0101`, JMP `0110`. Število izvedenih ukazov = (ukazi v enem obhodu) $\cdot\, n$ + ukazi ob izhodu.
:::

**Rešitev:**

1. (a) Načrt: na začetku zanke preverimo $n$; če je $0$, skočimo na konec. Sicer zmanjšamo $n$ in prištejemo $m$ k $S$, nato skočimo na začetek.
2. Program (naslov: ukaz):
```
0: LOAD 12   ; ACC = n
1: JZ 8      ; n = 0 -> konec
2: SUB 15    ; n - 1
3: STORE 12
4: LOAD 14   ; ACC = S
5: ADD 13    ; S + m
6: STORE 14
7: JMP 0
8: HALT
```
3. (b) Strojna koda: `1C 58 3F 4C 1E 2D 4E 60 00`; pri `58` je `5` koda JZ in `8` ciljni naslov, pri `60` je `6` koda JMP in `0` cilj.
4. (c) En obhod zanke izvede ukaze na naslovih $0$ do $7$, torej $8$ ukazov. Ob izhodu se izvedejo še LOAD, JZ (ki skoči) in HALT, torej $3$.
5. Pri $n = 3$: $8 \cdot 3 + 3 = 27$ ukazov; na koncu je $S = 3m$, v celici $12$ pa je $0$, ker je zanka $n$ porabila.
6. Pri $n = 1000$: $8 \cdot 1000 + 3 = 8003$ ukazov. Število raste linearno z $n$, ker učni procesor množi s ponavljanjem seštevanja; pravi procesorji imajo ukaz za množenje.
7. (d) Višji jezik (Python): `S = n * m`; prevajalnik ali tolmač sam izbere strojni ukaz za množenje.
8. SQL (4GL): `SELECT SUM(masa) FROM plosce;` Tu ne podamo niti $n$ niti zanke: sistem sam prešteje in sešteje vrstice, zato deluje tudi, če plošče niso enake.
9. Odgovor: zanka z $9$ ukazi (`1C 58 3F 4C 1E 2D 4E 60 00`) izvede $27$ ukazov pri $n = 3$ in $8003$ pri $n = 1000$. Isti račun je na 3. stopnji en izraz, na 4. stopnji ena poizvedba, ki opiše le želeni rezultat.

### Primer 4 – zdaj ti

Pri zanki iz Primera 3 je vsebina celice $12$ po koncu $0$. Kako bi program spremenil, da ohrani $n$?

**Podatki:** program iz Primera 3; prosta je celica $11$
**Iščemo:** spremembo, ki ohrani vrednost $n$

:::formula
Kopijo podatka naredimo z LOAD iz izvirne celice in STORE v prosto celico.
:::

**Rešitev:**

1. Zanka mora šteti v drugi celici, ne v $12$.
2. Na začetek dodamo dva ukaza, ki $n$ prepišeta v celico $11$, v zanki pa vse naslove $12$ zamenjamo z $11$.
3. Dokončaj sam: zapiši ukaza na začetku in razmisli, kaj se zgodi s ciljnimi naslovi skokov.

:::premisli
Kakšen je popravljeni program?
---
`0: LOAD 12`, `1: STORE 11`, nato zanka od naslova $2$: `LOAD 11`, `JZ 10`, `SUB 15`, `STORE 11`, `LOAD 14`, `ADD 13`, `STORE 14`, `JMP 2`, `HALT` na naslovu $10$. Ker sta se ukaza vrinila na začetek, se vsi naslovi premaknejo za $2$; cilj skoka JMP je zdaj $2$ (ne $0$, sicer bi kopijo vsakič znova naredili in zanka se ne bi končala), cilj JZ pa $10$. V zbirniku s **simboličnimi oznakami** (npr. `zanka:`) bi zbirnik naslove preračunal sam.
:::

## Pogoste napake

- **»Računalnik razume Python (ali C).«** Procesor izvaja le strojno kodo svoje družine. Program v C mora prevesti prevajalnik, program v Pythonu izvaja tolmač, ki je sam program v strojni kodi.
- **Zbirni jezik je »prenosljiv, ker je besedilo«.** Mnemoniki so le zapis strojnih ukazov ena proti ena; drug procesor ima druge ukaze in registre. Prenosljiv je višji jezik, in še ta le kot izvorna koda, ne kot prevedena datoteka.
- **Zamenjava prevajalnika in tolmača.** Prevajalnik prevede vse vnaprej in ustvari izvršljivo datoteko; tolmač prevaja in izvaja sproti. Ali je jezik »prevajan« ali »tolmačen«, je lastnost izvedbe, ne jezika: obstajajo prevajalniki za Python in tolmači za C.
- **»Višja generacija je vedno boljša.«** Generacija ne pomeni kakovosti. SQL je odličen za poizvedbe in neuporaben za gonilnik; za mikrokrmilnik z $2\,\mathrm{kB}$ pomnilnika je C boljša izbira od Pythona.
- **4GL zamenjan s »sodobnim« jezikom.** Python in Java sta novejša od SQL, a sta jezika 3. generacije, ker programer opiše postopek (kako). Za 4GL je značilna deklarativnost (kaj) in ozko področje.

## Povzetek

- Strojni jezik (1. gen.): dvojiški ukazi, ki jih procesor izvaja neposredno; vsaka družina procesorjev ima svoj nabor ukazov.
- Zbirni jezik (2. gen.): mnemoniki, ena vrstica = en strojni ukaz; prevede ga zbirnik; neprenosljiv, popoln nadzor.
- Višji jeziki (3. gen.): neodvisni od procesorja, en stavek = več ukazov; imperativni (kako); prevajalnik (vnaprej, izvršljiva datoteka) ali tolmač (sproti); vmesna pot bajtna koda in JIT.
- 4GL: deklarativni (kaj), za eno področje, npr. SQL; 5. gen.: logično programiranje (Prolog).
- Navzgor raste abstrakcija in hitrost pisanja, navzdol nadzor in hitrost izvajanja.

## Za izpit

Znati moraš povedati:

- definicije strojnega, zbirnega, višjega jezika in jezika 4. generacije z vsaj dvema primeroma;
- razliko med zbirnikom, prevajalnikom in tolmačem ter kaj je bajtna koda in prevajanje JIT;
- zakaj je zbirni jezik vezan na procesor in v kakšnem smislu je višji jezik prenosljiv;
- razliko med imperativnim (kako) in deklarativnim (kaj) zapisom;
- prevod kratkega programa iz zbirnega v strojni jezik in nazaj ter sledenje izvajanju.

### Naloga 1

Pri preizkusu materialov hranimo meji tečenja dveh jekel: $a = 235\,\mathrm{MPa}$ v celici $12$ in $b = 355\,\mathrm{MPa}$ v celici $13$. (a) Napiši zbirni program za učni procesor, ki v celico $14$ zapiše večjo od obeh vrednosti. (b) Prevedi ga v strojno kodo. (c) Sledi izvajanju in preštej izvedene ukaze. (d) Koliko bitov mora imeti ukaz, če pomnilnik povečamo na $64$ celic in ohranimo $4$-bitno operacijsko kodo?

**Rešitev:**

1. (a) Ideja: izračunamo $a - b$; če je negativno, je večji $b$, sicer $a$. Uporabimo JN (koda `0111`).
2. Program:
```
0: LOAD 12   ; ACC = a
1: SUB 13    ; ACC = a - b
2: JN 6      ; a < b -> naslov 6
3: LOAD 12
4: STORE 14  ; vecja = a
5: HALT
6: LOAD 13
7: STORE 14  ; vecja = b
8: HALT
```
3. (b) Strojna koda: `1C 3D 76 1C 4E 00 1D 4E 00` (`76` = JN na naslov $6$).
4. (c) ACC $= 235$, nato $235 - 355 = -120$. Ker je ACC $< 0$, JN skoči na naslov $6$.
5. Na naslovu $6$ ACC $= 355$, STORE ga zapiše v celico $14$, HALT ustavi. Izvedeni so ukazi na naslovih $0, 1, 2, 6, 7, 8$: skupaj $6$ ukazov.
6. Pri $a = b$ je razlika $0$, JN ne skoči in v celico $14$ gre $a$, kar je prav. Ukaz na naslovu $3$ je potreben, ker je ACC po odštevanju $a - b$, ne $a$.
7. (d) Za $64$ celic potrebujemo $\log_2 64 = 6$ bitov naslova; ukaz ima $4 + 6 = 10$ bitov.
8. Odgovor: program iz $9$ ukazov zapiše v celico $14$ vrednost $355\,\mathrm{MPa}$, izvede se $6$ ukazov; pri $64$ celicah je ukaz dolg $10$ bitov.

### Naloga 2

Natančno opiši, kako pride program do procesorja (a) v zbirnem jeziku, (b) v C, (c) v Pythonu in (d) v Javi. Utemelji, zakaj lahko isto izvorno datoteko v C uporabimo na prenosniku x86 in na telefonu ARM, iste izvršljive datoteke pa ne.

**Rešitev:**

1. (a) Zbirnik prevede vsako vrstico v natanko en strojni ukaz izbranega procesorja; nastane strojna koda za to družino.
2. (b) Prevajalnik za C prebere ves program, ga analizira, optimizira in prevede v strojno kodo izbranega procesorja; povezovalnik doda knjižnice. Nastane izvršljiva datoteka, ki teče brez prevajalnika.
3. (c) Tolmač Pythona bere izvorno kodo (navadno jo najprej pretvori v svojo bajtno kodo) in jo sproti izvaja; na računalniku mora biti nameščen tolmač.
4. (d) Prevajalnik za Javo prevede izvorno kodo v bajtno kodo navideznega stroja (JVM). Na vsakem računalniku jo JVM izvaja in vroče dele sproti prevaja v strojno kodo (JIT).
5. Prenosljivost: C ne vsebuje ukazov nobenega procesorja. Za x86 in za ARM obstaja prevajalnik, ki isto izvorno kodo prevede v strojno kodo vsakega posebej.
6. Izvršljiva datoteka pa že vsebuje strojne ukaze x86; procesor ARM ima drug nabor ukazov in jih ne zna izvesti.
7. Odgovor: prenosljiva je izvorna koda (in pri Javi bajtna koda), ne strojna koda; prenosljivost višjega jezika pomeni, da za vsak procesor obstaja prevajalnik ali tolmač.

### Naloga 3

Utemelji, ali velja: (a) »SQL je imperativni jezik, ker poizvedba `SELECT` vsebuje vrstni red besed.« (b) »Python je tolmačen jezik, zato program v Pythonu nikoli ne more teči tako hitro kot v C.« (c) »Vsak program v višjem jeziku je mogoče zapisati tudi v zbirnem jeziku.«

**Rešitev:**

1. (a) Ne velja. Vrstni red besed je le skladnja. Poizvedba ne določa postopka (zank, vrstnega reda pregledovanja, uporabe kazala); to izbere sistem baze. SQL je deklarativen.
2. (b) Ne velja v tej obliki. »Tolmačen« je lastnost običajne izvedbe, ne jezika. Prevajalniki JIT (npr. PyPy) in knjižnice, napisane v C (numerične knjižnice za delo s tabelami), dosežejo hitrost blizu C. Običajni tolmač je pri zankah res počasnejši, ker sproti razčlenjuje.
3. (c) Velja. Vsak višji program se na koncu izvaja kot strojna koda, ki jo prevajalnik ali tolmač ustvari; ta strojna koda ima ekvivalent v zbirnem jeziku ena proti ena. Program bi bil le veliko daljši in vezan na en procesor.
4. Odgovor: (a) ne, (b) ne, (c) da.

## Drugače: Z analogijo

Predstavljaj si gradnjo jeklene konstrukcije.

- **Strojni jezik** je navodilo varilcu v gibih roke: »premakni elektrodo $3\,\mathrm{mm}$ levo, zadrži $0{,}4\,\mathrm{s}$«. Natančno, a nihče ne bi tako opisal hale.
- **Zbirni jezik** so isti gibi z imeni: »zvari spoj A«. Še vedno korak za korakom, le berljivejše; drug varilni robot pa ima druge gibe.
- **Višji jezik** je delavniški načrt: »stebri HEA 200 na razmiku $6\,\mathrm{m}$, zvarjeni na nosilec«. Vsaka delavnica ga izvede s svojimi stroji (prevajalnik za svoj procesor).
- **4GL** je naročilo investitorja: »potrebujem halo $20 \times 40\,\mathrm{m}$ za skladišče«. Kako jo zgraditi, odloči projektant (sistem baze).

**Prevajalnik** je projektant, ki ves načrt najprej pretvori v delovna navodila in jih preda delavnici. **Tolmač** je delovodja, ki ob delavcih stoji in jim prebira načrt vrstico za vrstico.

## Drugače: Uporaba v stroki

**Krmiljenje strojev.** CNC-stroji in 3D-tiskalniki izvajajo G-kodo, ki je po zgradbi blizu zbirnemu jeziku: vsaka vrstica je en premik ali ukaz stroju. Datoteko G-kode navadno ustvari program CAM iz 3D-modela; inženir dela na višji stopnji in le preveri ali popravi posamezne vrstice.

**Mikrokrmilniki v senzorjih.** Merilni lističi (uporovni lističi) na mostovih pošiljajo podatke prek mikrokrmilnika s nekaj kilobajti pomnilnika. Programiramo ga v C; časovno kritične prekinitve včasih v zbirniku. Python bi tu potreboval preveč pomnilnika.

**Obdelava meritev.** Za izračun napetosti iz tisočev meritev, prileganje krivulj in grafe uporabljamo Python ali MATLAB (3. generacija z izrazito visokimi funkcijami). Numerične knjižnice so napisane v C in Fortranu, zato je račun hiter, čeprav program pišemo v tolmačenem jeziku.

**Baze materialov in preizkusov.** Laboratoriji hranijo rezultate natezanih preizkusov v podatkovnih bazah in jih iščejo s SQL; poročila iz baze sestavi generator poročil. Tu se 4GL najbolj izplača: poizvedba je kratka, sistem jo izvede učinkovito tudi pri milijonih vrstic.

## Drugače: Bolj natančno

**Faze prevajalnika.** Prevajalnik dela v zaporednih fazah: **leksikalna analiza** razreže besedilo na osnovne enote (imena, števila, operatorje); **sintaksna analiza** iz njih zgradi drevo po pravilih slovnice jezika; **semantična analiza** preveri pomen (tipe, deklaracije); sledi **vmesna koda**, **optimizacija** (npr. izračun konstantnih izrazov že med prevajanjem) in **generiranje strojne kode** za izbrani procesor. Zato isti prevajalnik z drugim zadnjim delom prevaja za različne procesorje.

**Povezovalnik.** Program je pogosto v več datotekah in uporablja knjižnice. Prevajalnik vsako datoteko prevede posebej v **objektno datoteko**, **povezovalnik** (angl. *linker*) pa jih združi v izvršljivo datoteko in razreši klice funkcij med njimi.

**Turingova polnost.** Jezik je **Turingovo poln**, če lahko izrazi vsak izračun, ki ga zmore računalnik (dovolj je pogojni skok in neomejen pomnilnik). Naš učni procesor z JZ ali JN in s pomnilnikom bi bil to pri neomejenem pomnilniku. Vsi običajni višji jeziki so Turingovo polni; zato so si enakovredni po tem, *kaj* lahko izračunajo, razlikujejo pa se po tem, kako udobno in hitro.

**Navidezni stroji.** Bajtna koda je strojni jezik namišljenega procesorja. Navidezni stroj (JVM za Javo, CLR za C#) je program, ki ta procesor posnema. Prevajalnik JIT med izvajanjem opazuje, kateri deli kode se izvajajo največkrat, in prav te prevede v pravo strojno kodo z optimizacijami, ki upoštevajo dejanske podatke.

## Preveri se

? Tehnik pravi: »Ta program je v jeziku, kjer vsaka vrstica ustreza natanko enemu ukazu procesorja, ukazi pa so zapisani z besedami, kot sta MOV in ADD.« V katerem jeziku je program?
- v strojnem jeziku
~ Strojni jezik je zapisan s števili (dvojiško ali šestnajstiško), ne z besedami.
+ v zbirnem jeziku
- v višjem jeziku
~ En stavek višjega jezika se prevede v več ukazov procesorja, ne v natanko enega.
> Mnemoniki (MOV, ADD) in razmerje ena proti ena sta značilnost zbirnega jezika; zbirnik ga prevede v strojno kodo.

? Razvrsti od najbližjega procesorju do najbolj oddaljenega: SQL, strojna koda, C, zbirni jezik.
- C, zbirni jezik, strojna koda, SQL
~ C je višji jezik in je dlje od procesorja kot zbirni jezik; razvrstitev je obrnjena.
+ strojna koda, zbirni jezik, C, SQL
- zbirni jezik, strojna koda, SQL, C
~ Zbirni jezik je le zapis strojne kode, zato je strojna koda bližje procesorju; SQL (4GL) je višje od C.
> Strojna koda je 1., zbirni jezik 2., C 3. generacija, SQL pa deklarativni jezik 4. generacije.

? Kaj se zgodi, če izvršljivo datoteko, ki jo je prevajalnik za C ustvaril za procesor x86, prenesemo na napravo s procesorjem ARM in jo poženemo?
- Teče enako, ker je C prenosljiv jezik.
~ Prenosljiva je izvorna koda v C; izvršljiva datoteka že vsebuje ukaze x86.
- Teče, a počasneje, ker jo ARM sproti tolmači.
~ Procesor ne tolmači tujih ukazov; to bi moral narediti poseben program (posnemovalnik), ki ga privzeto ni.
+ Ne teče, ker ARM ne razume strojnih ukazov x86; izvorno kodo je treba prevesti za ARM.
> Vsaka družina procesorjev ima svoj nabor ukazov. Isto izvorno datoteko prevedemo s prevajalnikom za ARM in dobimo novo izvršljivo datoteko.

? Učni procesor ima $8$-bitne ukaze: $4$ bite za operacijsko kodo in $4$ za naslov. Koliko pomnilniških celic lahko ukaz neposredno naslovi?
- $4$
~ $4$ je število bitov naslova, ne število različnih naslovov.
- $8$
~ $8$ je dolžina celega ukaza; za naslov so le $4$ biti.
+ $16$
> S $4$ biti zapišemo $2^4 = 16$ različnih naslovov, od $0$ do $15$.

? Zanka iz Primera 3 izvede $8$ ukazov na obhod in $3$ ukaze ob izhodu. Koliko ukazov izvede pri $n = 50$?
+ $403$
- $400$
~ Pozabil si na $3$ ukaze ob izhodu iz zanke (LOAD, JZ, HALT).
- $450$
~ To bi bilo $9$ ukazov na obhod (vseh $9$ ukazov programa); HALT se izvede le enkrat, ob izhodu.
> $8 \cdot 50 + 3 = 403$ ukazov.

:::simboli
L | dolžina zvarjene palice | L = L_1 + L_2 - p | cm
L_1, L_2 | dolžini palic | | cm
p | dolžina prekrivanja | | cm
S | skupna masa plošč | S = n \cdot m | kg
n | število plošč | | –
m | masa ene plošče | | kg
:::
